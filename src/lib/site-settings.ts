import path from 'path';
import { promises as fs } from 'fs';
import type { SiteSettings } from '@/types/site-settings';
import { DEFAULT_SITE_SETTINGS } from '@/types/site-settings';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function fileExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!(await fileExists(SETTINGS_FILE))) {
    return { ...DEFAULT_SITE_SETTINGS };
  }
  const content = await fs.readFile(SETTINGS_FILE, 'utf-8');
  if (!content.trim()) return { ...DEFAULT_SITE_SETTINGS };
  try {
    const parsed = JSON.parse(content) as Partial<SiteSettings>;
    return { ...DEFAULT_SITE_SETTINGS, ...parsed } as SiteSettings;
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function writeSiteSettings(settings: SiteSettings) {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}
