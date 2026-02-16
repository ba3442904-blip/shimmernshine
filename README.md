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

## Render Deployment
Use a Render Web Service with:
- Build command: `npm ci && npm run render:build`
- Start command: `npm run render:start`

Required environment variables:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXTAUTH_URL` (set this to your Render app URL, e.g. `https://your-app.onrender.com`)

Optional (for Cloudflare R2 gallery uploads on Render):
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_URL`
- `ALLOW_LOCAL_UPLOADS` (`true` to store uploads in `public/uploads` when R2 is not configured)
