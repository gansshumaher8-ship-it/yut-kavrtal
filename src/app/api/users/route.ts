import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { readUsers, writeUsers } from '@/lib/users';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  const users = await readUsers();
  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      login: u.login,
      role: u.role,
      name: u.name,
      agentId: u.agentId
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  let body: { login?: string; password?: string; name?: string; agentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Неверный формат запроса' }, { status: 400 });
  }

  const login = String(body.login ?? '').trim();
  const password = String(body.password ?? '');
  const name = String(body.name ?? '').trim();
  const agentId = String(body.agentId ?? '').trim() || undefined;

  if (!login || password.length < 6) {
    return NextResponse.json(
      { message: 'Укажите логин и пароль (не менее 6 символов)' },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const exists = users.some((u) => u.login.toLowerCase() === login.toLowerCase());
  if (exists) {
    return NextResponse.json({ message: 'Пользователь с таким логином уже существует' }, { status: 400 });
  }

  const id = (globalThis as any).crypto?.randomUUID?.() ?? `user-${Date.now()}`;
  const newUser = {
    id,
    login: login.toLowerCase(),
    passwordHash: hashPassword(password),
    role: 'agent' as const,
    name: name || login,
    agentId
  };

  users.push(newUser);
  await writeUsers(users);

  return NextResponse.json({
    id: newUser.id,
    login: newUser.login,
    role: newUser.role,
    name: newUser.name,
    agentId: newUser.agentId
  });
}
