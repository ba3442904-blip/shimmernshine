# Shimmer N Shine Detailing

Two-sided Next.js app:
- Public client website for a mobile detailing business
- Owner admin dashboard at `/admin`

## Tech
- Next.js App Router + TypeScript + Tailwind
- Prisma + Postgres
- NextAuth (Credentials) for single-owner login

## Setup
1) Install deps:
```bash
npm i
```

2) Create `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="change-me"
ADMIN_EMAIL="owner@shimmernshine.com"
ADMIN_PASSWORD="change-me"
NEXTAUTH_URL="http://localhost:3000"

```

3) Migrate + seed:
```bash
npx prisma migrate dev
npm run prisma:seed
```

4) Run:
```bash
npm run dev
```

Open:
- Client site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Admin
Use the seeded owner credentials from `.env`.

## Data
All client content is stored in Postgres via Prisma models:
- Services, pricing tiers, add-ons, gallery, reviews, FAQs
- Settings (business info, service area, SEO, booking mode)
- Leads (quote + booking requests)

## Notes
- Gallery uploads are stored locally in `public/uploads`.
- Edit business info via `/admin/settings`.

## Vercel Deployment

1. Push repo to GitHub
2. Import project at https://vercel.com/new
3. Vercel auto-detects Next.js — no build command changes needed
4. Set these environment variables in Vercel dashboard (Project > Settings > Environment Variables):
   - `DATABASE_URL` (Supabase pooler URL, port 6543, with `?pgbouncer=true`)
   - `DIRECT_URL` (Supabase direct URL, port 5432)
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_URL` (set to your Vercel deployment URL, e.g. `https://shimmernshine.vercel.app`)
5. Deploy — Vercel runs `npm run build` automatically
6. After first deploy, run migrations manually from local machine:
   ```bash
   npx prisma migrate deploy
   ```
