# Deploy Pixel State

This is the short guide to put the Pixel State site live. It takes about 30 to 60 minutes, plus time for DNS to update.

## What you need before you start

- A GitHub account
- A Vercel account
- The zip file, pixel-state-deployable.zip, which holds this code
- Your domain, pixelstate.com.au

You do not need to share any password with anyone to do this. You type passwords into GitHub and Vercel yourself.

## Step 1. Create a private GitHub repo

1. Go to GitHub and click New repository.
2. Name it `pixel-state`.
3. Set it to Private.
4. Do not add a README, a .gitignore or a licence in GitHub. The zip already has those files.
5. Create the repo.

## Step 2. Upload the code

1. Unzip pixel-state-deployable.zip on your computer.
2. Upload all the files from inside the unzipped folder into your new `pixel-state` repo, or use Git from your computer to push them.
3. Check the repo has these at the top level: README.md, DEPLOY.md, package.json, package-lock.json, app, components, lib, db, scripts, .env.example and .gitignore.
4. Check that `.env.local` is not in the repo. It holds local dev values only and must stay on this computer. The .gitignore file already blocks it.

## Step 3. Connect the repo in Vercel

1. Go to Vercel and click Add New, then Project.
2. Choose Import Project and pick your `pixel-state` repo from GitHub.
3. Accept the Vercel defaults for a Next.js project. Do not deploy yet. Set the environment variables first, in Step 5.

## Step 4. Create a Postgres database

1. In Vercel, go to Storage and create a Postgres database, or create one in Neon or Supabase if you prefer.
2. Copy the database connection string. It is the `DATABASE_URL` for the next step.
3. Run the migration against that database so the enquiries table exists. From your computer, in the code folder, run:
   - `DATABASE_URL="<your hosted database URL>" npm run db:migrate`
   - You should see: "Migration 001 applied. Enquiries table is ready."
4. Do this before you test the live site, or the enquiry form will fail.

## Step 5. Set the environment variables in Vercel

In Vercel, open your project, then Settings, then Environment Variables, and add these four. Use the Production scope for each one.

- `DATABASE_URL` - the hosted Postgres connection string from Step 4.
- `ADMIN_PASSWORD` - a long, random password you invent. This is the only password for the admin inbox at /admin. Do not reuse a password from another site.
- `ADMIN_SESSION_SECRET` - a different long, random string. You can generate one with a password manager.
- `CONTACT_EMAIL` - `hello@pixelstate.com.au`

Also set `NEXT_PUBLIC_SITE_URL` to `https://pixelstate.com.au` once DNS is done in Step 7. For the first deploy you can use the Vercel address it gives you.

## Step 6. Deploy

1. In Vercel, click Deploy.
2. Wait for the build to finish. It should succeed.
3. Open the Vercel address it gives you and check the home page loads and says Pixel State.
4. Open the admin login at `/admin` and sign in with your `ADMIN_PASSWORD` from Step 5. The inbox should start empty, with 0 enquiries.

## Step 7. Point your domain at Vercel

1. In Vercel, open your project, then Settings, then Domains, and add `pixelstate.com.au`.
2. Vercel will show you the DNS records to add.
3. Go to your domain registrar for pixelstate.com.au and add those DNS records exactly as Vercel shows them.
4. Wait for DNS to update. This can take minutes, or a few hours.
5. Open `https://pixelstate.com.au` and check it loads with a secure padlock. If it does not load yet, wait and try again later. Do not change anything else while DNS is still updating.

## Step 8. Test a real enquiry, then delete it

1. On your phone, open `https://pixelstate.com.au`.
2. Fill in the quote form with a test enquiry, using your own name and email, and submit it.
3. Sign in to `/admin` and check the test enquiry is there, with a follow-up due date 2 days later.
4. Delete the test enquiry in the admin inbox, so the live inbox starts empty with 0 enquiries.
5. Check the reply drafts, the quoted value field, and the CSV export while you are there.

## If something goes wrong

- Form fails to save: the database migration in Step 4 was probably not run, or `DATABASE_URL` is wrong in Vercel. Check both, then redeploy.
- Admin login fails: check `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Vercel. If you change them, redeploy.
- Domain does not load: check the DNS records match Vercel exactly, and wait longer. DNS can be slow.
- Build fails in Vercel: check the build log in Vercel for the first error, and check that `node_modules` and `.next` were not uploaded to GitHub. They are in .gitignore and should not be in the repo.

## What is not included yet

- No email is sent automatically. Reply drafts are copied into your own email app.
- No Stripe payments, booking, client login or CMS.
- Admin is one shared password, not separate user accounts.
- There is no spam protection on the public form yet. Add that before you share the site widely.
