# StoryNest / KahaniNest

A production-grade adult (18+) Hindi/Hinglish fiction reading platform built with Next.js 14 (App Router), TypeScript (strict), PostgreSQL on Neon, Prisma ORM, and Tailwind CSS.

> **Note**: **NO DOCKER** is required for local development. The project is specifically architected to run leanly on low-RAM (4GB) laptops with cloud-hosted PostgreSQL (Neon or Supabase).

---

## 🚀 Quick Start Guide

### 1. Create a Free Neon PostgreSQL Database
1. Go to [Neon Console](https://console.neon.tech/) and create a free account.
2. Create a new project (e.g. `storynest-db`).
3. Under **Dashboard > Connection Details**:
   - Check **Pooled connection** and copy the connection string. Set this as `DATABASE_URL` in your `.env` file (append `?sslmode=require`).
   - Switch to **Direct connection** (port 5432) and copy the string. Set this as `DIRECT_URL` in your `.env` file (append `?sslmode=require`).

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Database Migrations and Seed
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📜 Available NPM Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the production application |
| `npm run start` | Starts production server |
| `npm run lint` | Runs ESLint checks |
| `npm run typecheck` | Runs strict TypeScript verification (`tsc --noEmit`) |
| `npm run test` | Runs unit & integration test suites with Vitest |
| `npm run test:e2e` | Runs end-to-end tests with Playwright |
| `npm run db:migrate` | Runs Prisma database migrations in development |
| `npm run db:deploy` | Deploys pending migrations in production |
| `npm run db:seed` | Seeds the database with neutral sample data & admin account |
| `npm run db:studio` | Opens Prisma Studio GUI to view database records |
| `npm run format` | Formats files with Prettier |

---

## 📁 Architecture & Folder Structure

```
├── prisma/               # Prisma database schema and migrations
├── docs/                 # Documentation (low-RAM tips, deployment, SEO, security)
├── tests/
│   ├── unit/             # Vitest unit & integration tests
│   └── e2e/              # Playwright end-to-end test specs
└── src/
    ├── app/              # Next.js App Router (pages, layouts, routes)
    ├── components/
    │   ├── ui/           # Atomic UI elements (Button, Card, Badge, Modal)
    │   ├── layout/       # Header, Footer, Bottom Navigation Bar
    │   ├── story/        # Story cards, reader controls, typography
    │   ├── admin/        # Admin panel components
    │   ├── age-gate/     # 18+ Age verification overlay / gate
    │   └── ads/          # AdSlot components
    ├── config/           # Site metadata and global constants
    ├── lib/              # db client, env validator, utils, security, zod schemas
    └── server/
        ├── services/     # Business logic & database operations
        └── actions/      # Next.js Server Actions
```
