# Deployment and Launch Guide

## Option A: Vercel + Neon (Recommended)

1. **Database Setup**:
   - Create a project on [Neon.tech](https://neon.tech).
   - Under Project Dashboard, obtain the pooled connection string (`DATABASE_URL`) with `?sslmode=require&pgbouncer=true`.
   - Obtain direct connection string (`DIRECT_URL`) with `?sslmode=require`.

2. **Deploy to Vercel**:
   - Push repository to GitHub.
   - Import repository into Vercel.
   - Configure all environment variables from `.env.example`:
     - `DATABASE_URL`
     - `DIRECT_URL`
     - `AUTH_SECRET` (generate using `openssl rand -base64 32`)
     - `AGE_GATE_SECRET` (generate using `openssl rand -base64 32`)
     - `NEXT_PUBLIC_SITE_URL`
     - `SITE_NAME`
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
     - `RESEND_API_KEY`
     - `NOTIFY_EMAIL`
     - `AGE_GATE_MODE="overlay"`

3. **Database Migration & Seed**:
   - In terminal connected to the Neon DB:
     ```bash
     npm run db:deploy
     npm run db:seed
     ```
   - This creates all tables, pg_trgm extensions, initial categories, admin account, and 25 sample stories.

4. **Scheduled Publishing Cron**:
   - Setup a cron trigger (e.g. Vercel Cron or GitHub Action) to call:
     ```
     GET /api/cron/publish-scheduled
     Header: Authorization: Bearer <AUTH_SECRET>
     ```
