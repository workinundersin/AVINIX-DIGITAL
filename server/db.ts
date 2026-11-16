import fs from 'node:fs';
import path from 'node:path';
import {
  createDefaultContent,
  createDefaultPricing,
  createDefaultProjects,
} from '../src/data/defaults.ts';
import type {
  Inquiry,
  PortfolioProject,
  PricingConfig,
  SiteContent,
} from '../src/types/avenix.ts';

export interface AdminRecord {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  admin: AdminRecord | null;
  inquiries: Inquiry[];
  projects: PortfolioProject[];
  pricing: PricingConfig;
  content: SiteContent;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'avenix-db.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function createDefaultDatabase(): DatabaseSchema {
  return {
    admin: null,
    inquiries: [],
    projects: createDefaultProjects(),
    pricing: createDefaultPricing(),
    content: createDefaultContent(),
  };
}

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

let cachedDb: DatabaseSchema | null = null;

export function readDb(): DatabaseSchema {
  if (cachedDb) {
    return cachedDb;
  }
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const initial = createDefaultDatabase();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    cachedDb = parsed;
    return parsed;
  } catch {
    const fallback = createDefaultDatabase();
    writeDb(fallback);
    return fallback;
  }
}

export function writeDb(data: DatabaseSchema): void {
  ensureDirectories();
  const tmpFile = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
  cachedDb = data;
}
