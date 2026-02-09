# Shimmer N Shine Detailing

Two-sided Next.js app:
- Public client website for a mobile detailing business
- Owner admin dashboard at `/admin`

## Tech
- Next.js App Router + TypeScript + Tailwind
- Prisma + SQLite
- NextAuth (Credentials) for single-owner login

## Setup
1) Install deps:
```bash
npm i
```

2) Create `.env`:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="change-me"
ADMIN_EMAIL="owner@shimmernshine.com"
ADMIN_PASSWORD="change-me"
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
All client content is stored in SQLite via Prisma models:
- Services, pricing tiers, add-ons, gallery, reviews, FAQs
- Settings (business info, service area, SEO, booking mode)
- Leads (quote + booking requests)

## Notes
- Gallery uploads are stored locally in `public/uploads`.
- Edit business info via `/admin/settings`.

## Cloudflare D1 seed
Generate a D1 seed SQL file (non-destructive; uses `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env`):
```bash
npm run d1:seed
```

Apply it to your D1 database:
```bash
npx wrangler d1 execute shimmernshine --file prisma/seed_d1.sql --remote
```
