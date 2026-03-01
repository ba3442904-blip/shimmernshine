# Supabase Setup

## 1. Create project
Go to https://supabase.com > New Project. Save your database password.

## 2. Get connection strings
Project Settings > Database > Connection String

Copy both:
- Port 6543 (pooler) → DATABASE_URL
- Port 5432 (direct) → DIRECT_URL

## 3. Set environment variables
Copy .env.example to .env and fill in your Supabase URLs and passwords.

## 4. Run migrations
npx prisma migrate deploy

## 5. Seed the database
npm run prisma:seed

## 6. Verify
npx prisma studio
