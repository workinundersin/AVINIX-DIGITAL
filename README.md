# AVENIX DIGITAL — Official Website & Admin Platform

**Tagline:** Ideas Into Digital Reality

Full-stack TypeScript web application for **AVENIX DIGITAL** featuring a multi-page public agency website, contact inquiry capture, dynamic portfolio and pricing management, and a protected `/admin` dashboard.

---

## Pages & Features

### Public Website
- **Home (`/`)**: Hero showcase, Services Overview, Why Choose Us, Featured Demonstration Projects, Pricing Preview, 6-Step Development Process, and Inquiry CTA.
- **About Us (`/about`)**: Who We Are, Our Mission, Our Vision, What We Do, and Our Values.
- **Services (`/services`)**: Website Development and App Development service breakdowns with direct quote actions.
- **Pricing (`/pricing`)**: Dynamic starting packages (Basic ₹2,000, prominent Standard ₹5,000, Premium ₹10,000), third-party services clarification, and App Development custom quote banner.
- **Portfolio (`/portfolio`)**: Filterable showcase with demonstration project labels and detail modal previews.
- **Contact Us (`/contact`)**: Validated project inquiry form saved directly to the backend database, plus WhatsApp, email, phone, and social links.

### Protected Admin Dashboard (`/admin`)
- **Authentication**: First-time interactive administrator setup (or `.env` seeding), `scrypt` password hashing, HMAC-signed `HttpOnly` session cookies, password rotation, and logout.
- **Overview**: Live metrics for Total Inquiries, New Inquiries, In Progress Projects, Completed Projects, and Total Portfolio Projects.
- **Inquiry Management**: Search, filter by status (`New`, `Contacted`, `In Progress`, `Completed`), inspect descriptions, update statuses, and delete inquiries.
- **Portfolio Management**: Add, edit, delete, upload project images (`/uploads`), assign categories, and publish/unpublish projects.
- **Pricing Management**: Update Basic/Standard/Premium prices, features, App Development starting price, and disclaimer.
- **Website Content Management**: Edit homepage heading/description, About Us content, services, contact info, WhatsApp number, email, and social links.

---

## Local Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and set a strong `SESSION_SECRET`:
   ```bash
   cp .env.example .env
   ```
   Optional: Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` to pre-seed the administrator account on first boot. If left blank, visiting `/admin` on first launch presents a one-time setup screen to create the administrator account securely.

3. **Run in development**
   ```bash
   npm run dev
   ```
   The Express API and Vite React frontend run together on `http://localhost:3000`.

---

## Production Build & Deployment

1. **Type-check and build the frontend bundle**
   ```bash
   npm run lint
   npm run build
   ```

2. **Start the production server**
   ```bash
   NODE_ENV=production npm start
   ```
   This starts `server.ts` on `PORT` (defaults to `3000`), serving the compiled `dist/` bundle, `/uploads` assets, and `/api/*` endpoints.

3. **Data Persistence Note**
   Database records are persisted atomically in `data/avenix-db.json` and uploaded project images in `data/uploads/`. Mount `data/` on a persistent volume when deploying to container platforms such as Cloud Run, Railway, Render, or a VPS.
