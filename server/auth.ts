import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import { readDb, writeDb } from './db.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SECRET_FILE = path.join(DATA_DIR, 'session-secret.key');
export const SESSION_COOKIE_NAME = 'avenix_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSessionSecret(): string {
  const envSecret = process.env.SESSION_SECRET?.trim();
  if (envSecret && envSecret.length >= 16) {
    return envSecret;
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(SECRET_FILE)) {
    return fs.readFileSync(SECRET_FILE, 'utf-8').trim();
  }
  const generated = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
  return generated;
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, usedSalt, 64).toString('hex');
  return { hash: derived, salt: usedSalt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (derived.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(derived, storedBuffer);
}

interface SessionPayload {
  email: string;
  exp: number;
  v: string;
}

export function createSessionToken(email: string, versionHash: string): string {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_TTL_MS,
    v: versionHash.slice(0, 12),
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes('.')) {
    return null;
  }
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) {
    return null;
  }
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(signature, 'utf-8');
  const expectedBuf = Buffer.from(expectedSig, 'utf-8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf-8'),
    ) as SessionPayload;
    if (!payload.email || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return null;
    }
    const db = readDb();
    if (!db.admin || db.admin.email.toLowerCase() !== payload.email.toLowerCase()) {
      return null;
    }
    if (db.admin.passwordHash.slice(0, 12) !== payload.v) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) {
    return result;
  }
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

export function getAuthenticatedAdmin(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies[SESSION_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

  const token = cookieToken || bearerToken;
  if (!token) {
    return null;
  }
  const verified = verifySessionToken(token);
  return verified ? verified.email : null;
}

export function setSessionCookie(req: Request, res: Response, token: string): void {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const isHttps =
    req.secure ||
    (typeof forwardedProto === 'string' && forwardedProto.split(',')[0].trim() === 'https');

  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
  ];
  if (isHttps) {
    parts.push('Secure');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(req: Request, res: Response): void {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const isHttps =
    req.secure ||
    (typeof forwardedProto === 'string' && forwardedProto.split(',')[0].trim() === 'https');

  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'Max-Age=0',
    isHttps ? 'SameSite=None' : 'SameSite=Lax',
  ];
  if (isHttps) {
    parts.push('Secure');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminEmail = getAuthenticatedAdmin(req);
  if (!adminEmail) {
    res.status(401).json({ error: 'Unauthorized. Please log in as administrator.' });
    return;
  }
  (req as Request & { adminEmail?: string }).adminEmail = adminEmail;
  next();
}

export function seedAdminFromEnvIfPresent(): void {
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!envEmail || !envPassword) {
    return;
  }
  const db = readDb();
  if (db.admin) {
    return;
  }
  const { hash, salt } = hashPassword(envPassword);
  const now = new Date().toISOString();
  db.admin = {
    email: envEmail.toLowerCase(),
    passwordHash: hash,
    salt,
    createdAt: now,
    updatedAt: now,
  };
  writeDb(db);
}
