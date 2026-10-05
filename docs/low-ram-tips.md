# Low-RAM (4GB) Laptop Development Guidelines

When developing on a machine with limited memory (such as 4GB RAM), keep these practical rules in mind to prevent memory pressure, freezing, and thrashing:

1. **No Local Docker / Local Heavy Databases**:
   - Do **NOT** run Docker Desktop or local PostgreSQL/Redis daemons.
   - Use cloud-hosted serverless PostgreSQL (such as [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)) over SSL. Neon automatically suspends compute when inactive and uses 0 MB of your local RAM.

2. **Minimize Background Applications**:
   - Keep only **VS Code**, **one terminal window**, and **one browser tab** open.
   - Close resource-heavy apps like Discord, Spotify, Chrome multiple tabs, Slack, or Docker.

3. **Separate Dev Server and Test Suites**:
   - Do not run `npm run dev` and `npm test` or `npx playwright` simultaneously.
   - Stop the development server (`Ctrl + C`) before executing test runs or database migrations.

4. **Use Turbopack If Dev Server Feels Sluggish**:
   - Run `npx next dev --turbo` or update your dev command for faster incremental compilation and lower peak memory overhead.

5. **Restart Dev Server Periodically**:
   - If Next.js dev server memory grows over several hours of hot-reloading, restart it with `Ctrl + C` and `npm run dev`.
