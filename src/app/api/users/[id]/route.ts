import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { readUsers, writeUsers } from '@/lib/users';
import { hashPassword } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  const id = params.id;
  let body: { password?: string; agentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Неверный формат запроса' }, { status: 400 });
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
  }

  const user = users[index];
  if (user.role === 'admin') {
    return NextResponse.json({ message: 'Нельзя изменять учётную запись администратора' }, { status: 400 });
  }

  if (typeof body.password === 'string' && body.password.length >= 6) {
    users[index] = { ...user, passwordHash: hashPassword(body.password) };
  }
  if (body.agentId !== undefined) {
    users[index] = { ...users[index], agentId: body.agentId || undefined };
  }

  await writeUsers(users);

  const updated = users[index];
  return NextResponse.json({
    id: updated.id,
    login: updated.login,
    role: updated.role,
    name: updated.name,
    agentId: updated.agentId
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Доступ только для администратора' }, { status: 403 });
  }

  const id = params.id;
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
  }
  if (user.role === 'admin') {
    return NextResponse.json({ message: 'Нельзя удалить учётную запись администратора' }, { status: 400 });
  }

  const filtered = users.filter((u) => u.id !== id);
  await writeUsers(filtered);

  return NextResponse.json({ success: true });
}
