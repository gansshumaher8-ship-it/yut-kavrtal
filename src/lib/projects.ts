import path from 'path';
import { promises as fs } from 'fs';
import type { Project } from '@/types/project';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

export async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function projectsFileExists() {
  try {
    await fs.access(DATA_FILE);
    return true;
  } catch {
    return false;
  }
}

export async function readProjects(): Promise<Project[]> {
  const exists = await projectsFileExists();
  if (!exists) {
    return [];
  }

  const content = await fs.readFile(DATA_FILE, 'utf-8');
  if (!content.trim()) {
    return [];
  }

  return JSON.parse(content) as Project[];
}

export async function writeProjects(projects: Project[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

export async function getProjects() {
  return readProjects();
}

export async function getProjectById(id: string) {
  const projects = await readProjects();
  return projects.find((p) => p.id === id) ?? null;
}

