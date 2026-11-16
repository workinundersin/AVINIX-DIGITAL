import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { seedAdminFromEnvIfPresent } from './server/auth.ts';
import { readDb, UPLOADS_DIR } from './server/db.ts';
import { createApiRouter } from './server/routes.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  // Ensure DB is initialized and optional env admin is seeded
  readDb();
  seedAdminFromEnvIfPresent();

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '8mb' }));

  // Serve uploaded portfolio images
  app.use('/uploads', express.static(UPLOADS_DIR));

  // API endpoints
  app.use('/api', createApiRouter());

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AVENIX DIGITAL server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AVENIX DIGITAL server:', err);
  process.exit(1);
});
