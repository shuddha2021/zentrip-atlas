# ZenTrip Atlas

A travel destination explorer built with Next.js, TypeScript, Tailwind CSS, and Prisma + PostgreSQL.

## Features

- 🌍 Explore 24 travel destinations worldwide
- 📅 View climate data and recommendations by month
- 🏛️ Discover top places to visit in each country
- 🎨 Beautiful Gen-Z inspired pastel gradient design

---

## 🚀 Deploy in 3 Minutes (Free)

Deploy ZenTrip Atlas for free using **Vercel** (hosting) + **Neon** (PostgreSQL).

### Step 1: Create Neon Database (1 min)

1. Go to [neon.tech](https://neon.tech) and sign up (free tier)
2. Create a new project → name it `zentrip-atlas`
3. Copy the **Connection String** (starts with `postgresql://...`)

### Step 2: Deploy to Vercel (2 min)

1. Push this repo to GitHub (or fork it)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Set **Environment Variables** (see below)
5. Click **Deploy**

### Environment Variables for Vercel

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Neon connection string | ✅ |
| `NOINDEX` | `false` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Recommended |
| `ADMIN_SECRET` | Any secure random string | Recommended |
| `AFFILIATE_SKYSCANNER_ID` | Your Skyscanner affiliate ID | Optional |
| `AFFILIATE_BOOKING_ID` | Your Booking.com affiliate ID | Optional |
| `RESEND_API_KEY` | Resend API key for emails | Optional |
| `EMAIL_FROM` | Email sender address | Optional |

**Copy-paste template:**
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
NOINDEX=false
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
ADMIN_SECRET=your-secret-key-here
```

### Step 3: Verify Deployment ✅

After deploy, check these URLs work:

| URL | Expected |
|-----|----------|
| `/explorer` | Shows destination grid |
| `/country/CO?month=1` | Shows Colombia for January |
| `/where-to-go-in/1` | Shows best destinations for January |
| `/api/health` | Returns `{"ok": true}` |
| `/sitemap.xml` | Returns XML sitemap |
| `/robots.txt` | Returns robots directives |

---

## Run Locally

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (running locally)

### Setup

```bash
# 1. Create the database
createdb zentrip_atlas

# 2. Copy environment file and set your username
cp .env.example .env.local
# Edit .env.local and set DATABASE_URL to your local connection

# 3. Install dependencies
pnpm install

# 4. Run the full setup (generate client, run migrations, seed data)
pnpm start:local
```

The app will be available at http://localhost:3000

### Available Routes

- `/` - Landing page
- `/explorer` - Browse all destinations by month (default: December)
- `/explorer?month=6` - Browse destinations for June
- `/country/ES?month=12` - Spain trip board for December

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/recommendations?month=12` - Get recommendations for a month
- `GET /api/country/ES?month=12` - Get country details

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm check` | Run typecheck + lint |
| `pnpm smoke` | Run smoke tests (requires server running) |
| `pnpm alerts:run` | Dry-run email alerts (prints what would be sent) |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations (dev) |
| `pnpm db:migrate:deploy` | Run migrations (production-safe) |
| `pnpm db:seed` | Seed the database with demo data |
| `pnpm db:reset` | Reset database (drop all data and re-migrate) |
| `pnpm start:local` | Full local setup: generate + migrate + seed + dev |
| `pnpm vercel-build` | Vercel build: migrate deploy + next build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

---

## SEO Pages

ZenTrip Atlas includes programmatic SEO landing pages:

- `/where-to-go-in/[month]` - Best destinations for each month (1-12)
- `/best-time-to-visit/[code]` - When to visit each country
- `/sitemap.xml` - Auto-generated sitemap
- `/robots.txt` - Search engine directives

**SEO Safety:**
- Production (`NOINDEX=false`): robots.txt allows indexing
- Preview/Staging (`NOINDEX=true`): robots.txt disallows all crawlers

---

## Monetization Setup

### Affiliate Links

1. Sign up for affiliate programs:
   - [Skyscanner Affiliates](https://www.skyscanner.com/affiliates)
   - [Booking.com Affiliates](https://www.booking.com/affiliate-program)

2. Add your affiliate IDs to environment variables:
   ```
   AFFILIATE_SKYSCANNER_ID=your-skyscanner-id
   AFFILIATE_BOOKING_ID=your-booking-id
   ```

3. Affiliate links are automatically tracked. View clicks at:
   ```
   /admin/analytics?secret=YOUR_ADMIN_SECRET
   ```

### Analytics Dashboard

Access first-party analytics at `/admin/analytics?secret=YOUR_ADMIN_SECRET`

Tracks:
- Page views
- Outbound affiliate clicks (flights/stays)
- Saved trips
- Share button clicks
- Email signups

### Email Subscribers

Subscribers are collected via the signup form on `/best-time-to-visit/[code]` pages.

To send monthly recommendation emails:
```bash
pnpm alerts:run
```

Configure `RESEND_API_KEY` to send real emails, or leave unset to log to console.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Package Manager**: pnpm
