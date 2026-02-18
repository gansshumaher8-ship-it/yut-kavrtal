import path from 'path';
import { promises as fs } from 'fs';
import type { User } from '@/types/user';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function fileExists() {
  try {
    await fs.access(DATA_FILE);
    return true;
  } catch {
    return false;
  }
}

export async function readUsers(): Promise<User[]> {
  if (!(await fileExists())) return [];
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  if (!content.trim()) return [];
  return JSON.parse(content) as User[];
}

export async function writeUsers(users: User[]) {
  await ensureDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function findUserByLogin(login: string): Promise<User | null> {
  const users = await readUsers();
  const normalized = login.trim().toLowerCase();
  return users.find((u) => u.login.toLowerCase() === normalized) ?? null;
}
