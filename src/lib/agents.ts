import path from 'path';
import { promises as fs } from 'fs';
import type { Agent } from '@/types/agent';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'agents.json');

export async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function agentsFileExists() {
  try {
    await fs.access(DATA_FILE);
    return true;
  } catch {
    return false;
  }
}

export async function readAgents(): Promise<Agent[]> {
  const exists = await agentsFileExists();
  if (!exists) return [];
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  if (!content.trim()) return [];
  return JSON.parse(content) as Agent[];
}

export async function writeAgents(agents: Agent[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(agents, null, 2), 'utf-8');
}

export async function getAgents() {
  return readAgents();
}

export async function getAgentById(id: string) {
  const agents = await readAgents();
  return agents.find((a) => a.id === id) ?? null;
}
