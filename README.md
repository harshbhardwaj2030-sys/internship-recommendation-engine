# Pathway — Internship Recommendation Engine

A full-stack internship recommendation platform: students build a profile,
browse partner companies, and get a personalized, scored feed of internships
ranked by a transparent match algorithm.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Radix-based UI primitives, Framer Motion-ready
- **Backend:** Next.js Route Handlers (API routes)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (GitHub, Google, Email/Password via Credentials)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — a PostgreSQL connection string. Any local Postgres, [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) instance works.
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`.
- `GITHUB_ID` / `GITHUB_SECRET` and `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are optional — leave blank to disable those login options and use email/password only.

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run seed
```

This creates the schema and seeds **5 companies** and **10 internships**, plus
a ready-to-use demo account:

```
email:    demo@student.com
password: demopassword123
```

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
prisma/
  schema.prisma          # Users, Companies, Internships, Applications, NextAuth models
  seed.ts                 # Seed data: 5 companies, 10 internships, 1 demo user
src/
  app/
    page.tsx              # Landing page
    login/, signup/        # Auth pages
    onboarding/             # Multi-step profile setup
    dashboard/               # Personalized "Recommended for You" feed
    companies/                # Searchable/filterable company directory
    internships/[id]/          # Detail page: description, match breakdown, skill gaps
    api/
      auth/[...nextauth]/       # NextAuth handler
      auth/signup/               # Email/password account creation
      onboarding/                  # Save profile fields
      recommendations/              # Ranked, personalized internship list
      internships/[id]/              # Single internship + match breakdown
      companies/                       # Company directory search/filter
  lib/
    matching.ts             # Core Match Score algorithm (see below)
    auth.ts                  # NextAuth configuration
    prisma.ts                  # Prisma client singleton
  components/               # RecommendationCard, CompanyCard, OnboardingForm,
                               # EmptyState, NavBar, and shadcn-style UI primitives
```

## The matching algorithm

`src/lib/matching.ts` exports `calculateMatchScore(user, internship)`, a pure
function producing a 0–100 score from three weighted components:

| Component               | Weight | Logic                                                                 |
|--------------------------|--------|------------------------------------------------------------------------|
| Skills Overlap           | 40%    | Fraction of the internship's required skills the candidate already has |
| Domain Fit               | 30%    | Full points if the role's domain is in the candidate's interests       |
| Preference Alignment     | 30%    | Split 15/15 between location-type match and stipend meeting the target |

The function also returns `matchedSkills` and `missingSkills`, which power the
"Why you're a match" and "Skill Gaps" sections on the internship detail page.
Because it's a pure function, it's easy to unit test or tune independently of
the database or API layer.

## Notes on this environment

This project was built and code-reviewed in a sandboxed container without
outbound access to Prisma's binary CDN (`binaries.prisma.sh`), so
`prisma generate` and a full `next build` could not be executed here. The
schema, seed data, and application code follow standard, well-tested Prisma
and Next.js patterns and are expected to build cleanly with normal internet
access. If you hit any issue running `prisma generate` behind a restrictive
firewall, see Prisma's docs on configuring a custom binary mirror.

## Extending this project

- Swap the heuristic scorer for `pgvector` similarity search once you have
  richer skill/role embeddings.
- Add an `applications` flow so students can apply directly and companies can
  review candidates.
- Add company-side auth so partner companies can post and manage their own
  internships.
