import path from 'path';
import { promises as fs } from 'fs';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export interface AppSettings {
  telegramChannelId?: string;
}

const defaults: AppSettings = {
  telegramChannelId: undefined
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readSettings(): Promise<AppSettings> {
  try {
    const content = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(content) as Partial<AppSettings>;
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export async function writeSettings(settings: Partial<AppSettings>) {
  await ensureDataDir();
  const current = await readSettings();
  const merged = { ...current, ...settings };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
