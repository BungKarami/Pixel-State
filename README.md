# Pixel State, deployable merged site

One app that serves both the public Pixel State website and the private admin inbox. A visitor who submits the quote or free review form on the public site saves directly into the same Postgres database the admin reads. No separate Muse artifact is needed once this is deployed.

## What is in here

Public site, Bendigo website agency, tagline "Level the playing field."

- Hero, pains, 100 percent ownership section, six services, six filterable concept portfolio builds labelled "Concept build", approved pricing, interactive estimator, 4-step process, three Sample testimonial cards labelled "Sample" with the headline "What Bendigo businesses will say", free website review offer, FAQ, and a quote form for a fixed quote or a free website review, reply within one business day.
- Pricing kept exact: Starter $1,490 to $1,990, Growth $2,990 to $3,490, Care $49 to $99 per month.
- Address: 33 Creek St S, Bendigo VIC 3550. No phone yet.
- Design: black and cyan, modern bold creative, mobile responsive, system fonts only. No Google Fonts are loaded at runtime.
- Copy is free of em dashes.

Admin inbox, at `/admin`, private, password protected:

- Pipeline counts New, Contacted, Quoted, Won, Lost, search, status and type filters, per-enquiry contact details and message, status buttons, private notes, two-step delete.
- Follow-up due date auto-set to +2 days on submission, with Today, Tomorrow, +2 days and +1 week shortcuts, and a Needs attention banner for overdue or stale New leads.
- Quoted dollar value in AUD, with $1,490, $1,990, $2,990 and $3,490 presets, and money totals for total quoted, pipeline, Won and open pipeline.
- One-tap reply drafts pre-filled from the enquiry, First reply, Quote ready and Follow-up nudge, editable, with Copy draft, Open in email app, and Mark as Contacted.
- CSV export respecting status and type filters.
- Oldest waiting sort, plus Oldest first, Newest first and Follow-up due soonest. Oldest waiting puts New leads first by oldest created date, overdue first within New.
- The inbox starts empty, 0 rows. No fake leads, no invented clients, results or testimonials.

## Stack, and why

Next.js 14 App Router, React 18, TypeScript, node-postgres (`pg`), PostgreSQL 16, plain SQL migrations.

- Next.js App Router was chosen because one app can serve the public pages, the admin pages, and the API routes, so the public form and the admin read the same database with no extra service to keep in sync.
- `pg` with plain SQL was chosen because it is the standard Postgres driver, it needs no binary engine download, and the schema is explicit SQL in `db/migrations/`, which any Postgres host can run. The same queries work locally and in production.
- PostgreSQL was chosen because it is the standard hosted database for Vercel, Neon and Supabase, and it handles the enquiry, status and money fields without a separate service.
- No email service is wired in yet. Reply drafts are copied into your own email app. That keeps the first deploy simple and avoids sending mail to a placeholder address.

## Local setup

Requirements: Node 18.17 or newer, npm, and PostgreSQL 16.

1. Install dependencies:

```bash
npm install
```

2. Create a local database and user, or use an existing local Postgres:

```sql
CREATE USER pixelstate WITH PASSWORD 'pixelstate_dev';
CREATE DATABASE pixelstate OWNER pixelstate;
```

3. Copy the environment file and edit it:

```bash
cp .env.example .env.local
```

Set `DATABASE_URL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in `.env.local`. Use long random values for the admin password and session secret, even locally.

4. Run the database migration, which creates the `enquiries` table:

```bash
npm run db:migrate
```

This runs `db/migrations/001_create_enquiries.sql` against `DATABASE_URL`. It is safe to run again, it uses `CREATE TABLE IF NOT EXISTS`.

5. Start the app:

```bash
npm run dev
```

Open http://localhost:3000 for the public site, and http://localhost:3000/admin for the inbox. Sign in with the `ADMIN_PASSWORD` you set.

To build for production locally:

```bash
npm run build
npm run start
```

## Environment variables

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Postgres connection string, for example `postgresql://pixelstate:pixelstate_dev@localhost:5432/pixelstate?schema=public` |
| `ADMIN_PASSWORD` | Admin inbox password. No working default is shipped. Set a long random password. |
| `ADMIN_SESSION_SECRET` | Long random secret used to sign the admin session cookie. |
| `CONTACT_EMAIL` | Public contact email shown on the site. See the domain note below. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for absolute links. |

## Deploy to Vercel with a hosted Postgres

1. Push this folder to a private Git repository.
2. In Vercel, import the repository as a Next.js project.
3. Create a hosted Postgres database. Vercel Postgres, Neon and Supabase all work. Copy its connection string.
4. In Vercel, set the environment variables from the table above, using the hosted `DATABASE_URL`, a long random `ADMIN_PASSWORD`, a long random `ADMIN_SESSION_SECRET`, and `CONTACT_EMAIL` set to hello@pixelstate.com.au.
5. Deploy. After the first deploy, run the migration against the hosted database from your machine:

```bash
DATABASE_URL="<hosted postgres url>" npm run db:migrate
```

6. Point pixelstate.com.au at Vercel in the Vercel dashboard, and follow its DNS instructions. Vercel issues the SSL certificate.
7. Test on your phone: submit a test enquiry on the live site, sign in to `/admin`, check it appears at the top of the inbox with a follow-up date 2 days ahead, then delete the test enquiry.

## What is still needed before publishing

This code is not live or published. Do not publish it until these are done:

- Domain and contact email. The domain is now pixelstate.com.au, and the contact email is hello@pixelstate.com.au. Set `CONTACT_EMAIL` to hello@pixelstate.com.au in production. The old Future Pixel name is no longer used.
- Admin password and session secret. Set long random values in Vercel, not the example values.
- Hosted Postgres database, created and migrated, as above.
- Domain pixelstate.com.au DNS pointed at the host, and SSL confirmed.
- A live end-to-end test, then delete the test enquiry so the inbox starts empty.
- Privacy and terms pages are included as starting points only. Have them checked by a qualified adviser before you rely on them.
- Replace the Sample testimonial cards and the concept portfolio builds with real client work and real reviews before you present the site as a launched agency site.

## API routes

All admin routes require the admin session cookie, set by signing in at `/admin/login`.

- `POST /api/enquiries`, public. Validates required name and valid email, and requires a current website for a free review. Sets follow-up due date to +2 days.
- `GET /api/enquiries?q=&status=&type=&sort=`, admin. Returns enquiries, pipeline counts, money totals and attention counts. Sort values: `oldest_waiting`, `oldest`, `newest`, `follow_up`.
- `PATCH /api/enquiries/[id]`, admin. Updates status (new, contacted, quoted, won, lost only), notes, quoted value in AUD, or follow-up due date.
- `DELETE /api/enquiries/[id]`, admin. Deletes one enquiry. The UI asks twice before calling it.
- `GET /api/enquiries/export?status=&type=`, admin. Downloads `pixel-state-enquiries-YYYY-MM-DD.csv`.
- `POST /api/auth/login`, admin. Checks `ADMIN_PASSWORD` and sets a signed, httpOnly session cookie.
- `POST /api/auth/logout`, admin. Clears the session cookie.

## Files

- `app/page.tsx`, public site.
- `app/admin/page.tsx` and `app/admin/login/page.tsx`, admin inbox and sign in.
- `components/QuoteForm.tsx`, `components/Estimator.tsx`, `components/Portfolio.tsx`, public site pieces.
- `components/AdminInbox.tsx`, admin inbox, pipeline, money, drafts, CSV and sorting.
- `app/api/enquiries/`, `app/api/auth/`, API routes listed above.
- `lib/db.ts`, `lib/auth.ts`, `lib/validation.ts`, `lib/replyDrafts.ts`, shared helpers.
- `db/migrations/001_create_enquiries.sql`, database schema as plain SQL, and `scripts/migrate.mjs`, the migration runner used by `npm run db:migrate`.
- `app/globals.css`, design tokens and layout, system fonts only.
