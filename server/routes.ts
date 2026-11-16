import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Router, type Request, type Response } from 'express';
import type {
  BudgetOption,
  DashboardOverview,
  Inquiry,
  InquiryStatus,
  PortfolioProject,
  PricingConfig,
  ProjectCategory,
  ServiceRequiredOption,
  SiteContent,
} from '../src/types/avenix.ts';
import {
  clearSessionCookie,
  createSessionToken,
  getAuthenticatedAdmin,
  hashPassword,
  requireAdmin,
  setSessionCookie,
  verifyPassword,
} from './auth.ts';
import { readDb, UPLOADS_DIR, writeDb } from './db.ts';

const ALLOWED_SERVICES: ServiceRequiredOption[] = [
  'Website Development',
  'App Development',
  'Both',
];

const ALLOWED_BUDGETS: BudgetOption[] = [
  '₹2,000–₹5,000',
  '₹5,000–₹10,000',
  '₹10,000+',
  'Custom Budget',
];

const ALLOWED_STATUSES: InquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Completed',
];

const ALLOWED_CATEGORIES: ProjectCategory[] = [
  'Restaurant Website',
  'Business Website',
  'E-commerce Website',
  'Portfolio Website',
  'Android Application',
  'Custom Software',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic in-memory login attempt tracking per IP
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 15) {
    return false;
  }
  entry.count += 1;
  return true;
}

export function createApiRouter(): Router {
  const router = Router();

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ---------------------------------------------------------------------------
  // PUBLIC CONTENT, PRICING, PORTFOLIO & INQUIRY SUBMISSION
  // ---------------------------------------------------------------------------
  router.get('/content', (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.content);
  });

  router.get('/pricing', (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.pricing);
  });

  router.get('/projects', (_req: Request, res: Response) => {
    const db = readDb();
    const published = db.projects.filter((project) => project.published);
    res.json(published);
  });

  router.post('/inquiries', (req: Request, res: Response) => {
    const body = req.body as Partial<Inquiry>;
    const fullName = String(body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const businessName = String(body.businessName ?? '').trim();
    const serviceRequired = body.serviceRequired as ServiceRequiredOption;
    const budget = body.budget as BudgetOption;
    const projectDescription = String(body.projectDescription ?? '').trim();

    if (fullName.length < 2 || fullName.length > 120) {
      res.status(400).json({ error: 'Please enter a valid full name (2–120 characters).' });
      return;
    }
    if (!EMAIL_REGEX.test(email) || email.length > 160) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (phone.length < 7 || phone.length > 30) {
      res.status(400).json({ error: 'Please enter a valid phone or WhatsApp number.' });
      return;
    }
    if (!ALLOWED_SERVICES.includes(serviceRequired)) {
      res.status(400).json({ error: 'Please select a valid service option.' });
      return;
    }
    if (!ALLOWED_BUDGETS.includes(budget)) {
      res.status(400).json({ error: 'Please select a valid budget range.' });
      return;
    }
    if (projectDescription.length < 10 || projectDescription.length > 3000) {
      res.status(400).json({
        error: 'Please provide a brief project description (10–3000 characters).',
      });
      return;
    }

    const db = readDb();
    const now = new Date().toISOString();
    const newInquiry: Inquiry = {
      id: `inq_${crypto.randomUUID().slice(0, 8)}`,
      fullName,
      email,
      phone,
      businessName: businessName.slice(0, 140),
      serviceRequired,
      budget,
      projectDescription,
      status: 'New',
      createdAt: now,
      updatedAt: now,
    };

    db.inquiries.unshift(newInquiry);
    writeDb(db);
    res.status(201).json({ ok: true, id: newInquiry.id });
  });

  // ---------------------------------------------------------------------------
  // ADMIN AUTHENTICATION
  // ---------------------------------------------------------------------------
  router.get('/auth/status', (req: Request, res: Response) => {
    const db = readDb();
    const authenticatedEmail = getAuthenticatedAdmin(req);
    res.json({
      initialized: Boolean(db.admin),
      authenticated: Boolean(authenticatedEmail),
      email: authenticatedEmail,
    });
  });

  router.post('/auth/setup', (req: Request, res: Response) => {
    const db = readDb();
    if (db.admin) {
      res.status(403).json({
        error: 'Administrator account is already configured. Please sign in.',
      });
      return;
    }

    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Please provide a valid administrator email address.' });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();
    db.admin = {
      email,
      passwordHash: hash,
      salt,
      createdAt: now,
      updatedAt: now,
    };
    writeDb(db);

    const token = createSessionToken(db.admin.email, db.admin.passwordHash);
    setSessionCookie(req, res, token);
    res.status(201).json({
      authenticated: true,
      email: db.admin.email,
      token,
    });
  });

  router.post('/auth/login', (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (!checkLoginRateLimit(clientIp)) {
      res.status(429).json({ error: 'Too many login attempts. Please wait a few minutes.' });
      return;
    }

    const db = readDb();
    if (!db.admin) {
      res.status(400).json({
        error: 'No administrator account has been configured yet.',
      });
      return;
    }

    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (
      email !== db.admin.email.toLowerCase() ||
      !verifyPassword(password, db.admin.passwordHash, db.admin.salt)
    ) {
      res.status(401).json({ error: 'Invalid administrator email or password.' });
      return;
    }

    const token = createSessionToken(db.admin.email, db.admin.passwordHash);
    setSessionCookie(req, res, token);
    res.json({
      authenticated: true,
      email: db.admin.email,
      token,
    });
  });

  router.post('/auth/logout', (req: Request, res: Response) => {
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  router.post('/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const currentPassword = String(req.body?.currentPassword ?? '');
    const newPassword = String(req.body?.newPassword ?? '');

    const db = readDb();
    if (!db.admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }
    if (!verifyPassword(currentPassword, db.admin.passwordHash, db.admin.salt)) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: 'New password must be between 8 and 128 characters.' });
      return;
    }

    const { hash, salt } = hashPassword(newPassword);
    db.admin.passwordHash = hash;
    db.admin.salt = salt;
    db.admin.updatedAt = new Date().toISOString();
    writeDb(db);

    const token = createSessionToken(db.admin.email, db.admin.passwordHash);
    setSessionCookie(req, res, token);
    res.json({ ok: true, token });
  });

  // ---------------------------------------------------------------------------
  // PROTECTED ADMIN ROUTES
  // ---------------------------------------------------------------------------
  router.get('/admin/overview', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const overview: DashboardOverview = {
      totalInquiries: db.inquiries.length,
      newInquiries: db.inquiries.filter((i) => i.status === 'New').length,
      inProgressProjects: db.inquiries.filter((i) => i.status === 'In Progress').length,
      completedProjects: db.inquiries.filter((i) => i.status === 'Completed').length,
      totalPortfolioProjects: db.projects.length,
      publishedPortfolioProjects: db.projects.filter((p) => p.published).length,
    };
    res.json(overview);
  });

  // Inquiries
  router.get('/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.inquiries);
  });

  router.patch('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const status = req.body?.status as InquiryStatus;
    if (!ALLOWED_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid inquiry status.' });
      return;
    }

    const db = readDb();
    const index = db.inquiries.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }

    db.inquiries[index] = {
      ...db.inquiries[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    res.json(db.inquiries[index]);
  });

  router.delete('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    const before = db.inquiries.length;
    db.inquiries = db.inquiries.filter((item) => item.id !== id);
    if (db.inquiries.length === before) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    writeDb(db);
    res.json({ ok: true });
  });

  // Projects
  router.get('/admin/projects', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.projects);
  });

  router.post('/admin/projects', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<PortfolioProject>;
    const title = String(body.title ?? '').trim();
    const category = body.category as ProjectCategory;
    const description = String(body.description ?? '').trim();
    const imageUrl = String(body.imageUrl ?? '').trim();
    const livePreviewSummary = String(body.livePreviewSummary ?? '').trim();
    const highlights = Array.isArray(body.highlights)
      ? body.highlights.map((h) => String(h).trim()).filter(Boolean)
      : [];
    const techStack = Array.isArray(body.techStack)
      ? body.techStack.map((t) => String(t).trim()).filter(Boolean)
      : [];

    if (title.length < 3 || title.length > 160) {
      res.status(400).json({ error: 'Project title must be between 3 and 160 characters.' });
      return;
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      res.status(400).json({ error: 'Please select a valid project category.' });
      return;
    }
    if (description.length < 10 || description.length > 2000) {
      res.status(400).json({ error: 'Description must be between 10 and 2000 characters.' });
      return;
    }

    const db = readDb();
    const now = new Date().toISOString();
    const created: PortfolioProject = {
      id: `proj_${crypto.randomUUID().slice(0, 8)}`,
      title,
      category,
      description,
      highlights: highlights.slice(0, 8),
      techStack: techStack.slice(0, 8),
      imageUrl: imageUrl || '/src/assets/images/portfolio_business_web_1794811330498.jpg',
      isDemo: Boolean(body.isDemo),
      published: body.published !== undefined ? Boolean(body.published) : true,
      livePreviewSummary: livePreviewSummary || description,
      createdAt: now,
      updatedAt: now,
    };

    db.projects.unshift(created);
    writeDb(db);
    res.status(201).json(created);
  });

  router.put('/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.projects.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const existing = db.projects[index];
    const body = req.body as Partial<PortfolioProject>;
    const title = String(body.title ?? existing.title).trim();
    const category = (body.category ?? existing.category) as ProjectCategory;
    const description = String(body.description ?? existing.description).trim();

    if (title.length < 3 || title.length > 160) {
      res.status(400).json({ error: 'Project title must be between 3 and 160 characters.' });
      return;
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      res.status(400).json({ error: 'Invalid project category.' });
      return;
    }
    if (description.length < 10 || description.length > 2000) {
      res.status(400).json({ error: 'Description must be between 10 and 2000 characters.' });
      return;
    }

    db.projects[index] = {
      ...existing,
      title,
      category,
      description,
      imageUrl:
        body.imageUrl !== undefined ? String(body.imageUrl).trim() || existing.imageUrl : existing.imageUrl,
      highlights: Array.isArray(body.highlights)
        ? body.highlights.map((h) => String(h).trim()).filter(Boolean).slice(0, 8)
        : existing.highlights,
      techStack: Array.isArray(body.techStack)
        ? body.techStack.map((t) => String(t).trim()).filter(Boolean).slice(0, 8)
        : existing.techStack,
      isDemo: body.isDemo !== undefined ? Boolean(body.isDemo) : existing.isDemo,
      published: body.published !== undefined ? Boolean(body.published) : existing.published,
      livePreviewSummary:
        body.livePreviewSummary !== undefined
          ? String(body.livePreviewSummary).trim() || description
          : existing.livePreviewSummary,
      updatedAt: new Date().toISOString(),
    };

    writeDb(db);
    res.json(db.projects[index]);
  });

  router.patch('/admin/projects/:id/publish', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.projects.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    db.projects[index] = {
      ...db.projects[index],
      published: Boolean(req.body?.published),
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    res.json(db.projects[index]);
  });

  router.delete('/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    const before = db.projects.length;
    db.projects = db.projects.filter((item) => item.id !== id);
    if (db.projects.length === before) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    writeDb(db);
    res.json({ ok: true });
  });

  // Upload project image (data URL -> saved to data/uploads)
  router.post('/admin/upload', requireAdmin, (req: Request, res: Response) => {
    const dataUrl = String(req.body?.dataUrl ?? '');
    const match = /^data:(image\/(png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Only PNG, JPG, or WEBP image uploads are supported.' });
      return;
    }

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const buffer = Buffer.from(match[3], 'base64');
    if (buffer.byteLength > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'Image size must be 5 MB or smaller.' });
      return;
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const filename = `project_${Date.now()}_${crypto.randomUUID().slice(0, 6)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    res.status(201).json({ url: `/uploads/${filename}` });
  });

  // Pricing Management
  router.put('/admin/pricing', requireAdmin, (req: Request, res: Response) => {
    const payload = req.body as Partial<PricingConfig>;
    if (!Array.isArray(payload.packages) || payload.packages.length !== 3) {
      res.status(400).json({ error: 'Pricing must include Basic, Standard, and Premium packages.' });
      return;
    }

    for (const pkg of payload.packages) {
      if (typeof pkg.price !== 'number' || Number.isNaN(pkg.price) || pkg.price < 0) {
        res.status(400).json({ error: `Invalid price for ${pkg.name}.` });
        return;
      }
      if (!Array.isArray(pkg.features) || pkg.features.length === 0) {
        res.status(400).json({ error: `${pkg.name} must include at least one feature.` });
        return;
      }
    }

    const appStartingPrice = Number(payload.appDevelopment?.startingPrice ?? 10000);
    if (Number.isNaN(appStartingPrice) || appStartingPrice < 0) {
      res.status(400).json({ error: 'Invalid App Development starting price.' });
      return;
    }

    const db = readDb();
    db.pricing = {
      packages: payload.packages.map((pkg) => ({
        id: pkg.id,
        name: String(pkg.name).trim(),
        targetAudience: String(pkg.targetAudience).trim(),
        price: Math.round(Number(pkg.price)),
        currency: String(pkg.currency || '₹').trim(),
        featured: Boolean(pkg.featured),
        features: pkg.features.map((f) => String(f).trim()).filter(Boolean),
      })),
      appDevelopment: {
        startingPrice: Math.round(appStartingPrice),
        currency: String(payload.appDevelopment?.currency || '₹').trim(),
        note: String(
          payload.appDevelopment?.note || db.pricing.appDevelopment.note,
        ).trim(),
      },
      disclaimer: String(payload.disclaimer || db.pricing.disclaimer).trim(),
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    res.json(db.pricing);
  });

  // Website Content Management
  router.put('/admin/content', requireAdmin, (req: Request, res: Response) => {
    const payload = req.body as Partial<SiteContent>;
    const db = readDb();

    const updated: SiteContent = {
      ...db.content,
      companyName: String(payload.companyName ?? db.content.companyName).trim() || 'AVENIX DIGITAL',
      tagline: String(payload.tagline ?? db.content.tagline).trim() || 'Ideas Into Digital Reality',
      heroHeading: String(payload.heroHeading ?? db.content.heroHeading).trim(),
      heroSubheading: String(payload.heroSubheading ?? db.content.heroSubheading).trim(),
      aboutWhoWeAre: String(payload.aboutWhoWeAre ?? db.content.aboutWhoWeAre).trim(),
      aboutMission: String(payload.aboutMission ?? db.content.aboutMission).trim(),
      aboutVision: String(payload.aboutVision ?? db.content.aboutVision).trim(),
      aboutWhatWeDo: String(payload.aboutWhatWeDo ?? db.content.aboutWhatWeDo).trim(),
      aboutValues: Array.isArray(payload.aboutValues)
        ? payload.aboutValues
            .map((v) => ({
              title: String(v.title ?? '').trim(),
              description: String(v.description ?? '').trim(),
            }))
            .filter((v) => v.title && v.description)
        : db.content.aboutValues,
      services: Array.isArray(payload.services) && payload.services.length > 0
        ? payload.services.map((s) => ({
            id: s.id,
            title: String(s.title ?? '').trim(),
            subtitle: String(s.subtitle ?? '').trim(),
            description: String(s.description ?? '').trim(),
            categories: Array.isArray(s.categories)
              ? s.categories.map((c) => String(c).trim()).filter(Boolean)
              : [],
            features: Array.isArray(s.features)
              ? s.features.map((f) => String(f).trim()).filter(Boolean)
              : [],
          }))
        : db.content.services,
      contact: {
        email: String(payload.contact?.email ?? db.content.contact.email).trim(),
        phone: String(payload.contact?.phone ?? db.content.contact.phone).trim(),
        whatsappNumber: String(
          payload.contact?.whatsappNumber ?? db.content.contact.whatsappNumber,
        )
          .replace(/[^0-9]/g, '')
          .trim(),
        location: String(payload.contact?.location ?? db.content.contact.location).trim(),
        businessHours: String(
          payload.contact?.businessHours ?? db.content.contact.businessHours,
        ).trim(),
        socialLinks: {
          linkedin: String(
            payload.contact?.socialLinks?.linkedin ?? db.content.contact.socialLinks.linkedin,
          ).trim(),
          instagram: String(
            payload.contact?.socialLinks?.instagram ?? db.content.contact.socialLinks.instagram,
          ).trim(),
          twitter: String(
            payload.contact?.socialLinks?.twitter ?? db.content.contact.socialLinks.twitter,
          ).trim(),
          github: String(
            payload.contact?.socialLinks?.github ?? db.content.contact.socialLinks.github,
          ).trim(),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    db.content = updated;
    writeDb(db);
    res.json(db.content);
  });

  return router;
}
