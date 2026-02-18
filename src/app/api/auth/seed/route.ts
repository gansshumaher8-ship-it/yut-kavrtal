import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/users';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  const users = await readUsers();
  return NextResponse.json({ allowed: users.length === 0 });
}

export async function POST(request: NextRequest) {
  try {
    const users = await readUsers();
    if (users.length > 0) {
      return NextResponse.json({ message: 'Пользователи уже существуют' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const login = String(body.login ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const name = String(body.name ?? 'Администратор').trim();

    if (!login || password.length < 6) {
      return NextResponse.json(
        { message: 'Нужны логин и пароль не короче 6 символов' },
        { status: 400 }
      );
    }

    const id = (globalThis as any).crypto?.randomUUID?.() ?? `user-${Date.now()}`;
    const newUser = {
      id,
      login,
      passwordHash: hashPassword(password),
      role: 'admin' as const,
      name
    };

    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json({ success: true, message: 'Первый пользователь создан' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Ошибка' }, { status: 500 });
  }
}
