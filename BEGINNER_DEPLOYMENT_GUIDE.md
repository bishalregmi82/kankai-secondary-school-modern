# Beginner Deployment Guide

This guide is for the Vercel + Supabase + Render + Cloudinary setup. It avoids Firebase completely.

You do not need a private domain at the beginning. Vercel and Render will give you free website addresses.

## What Each Service Does

```txt
GitHub      Keeps the website files online.
Vercel      Shows the public school website to visitors.
Supabase    Stores CMS text, pages, notices, users and database records.
Cloudinary  Stores images, logos, gallery photos, PDFs and documents.
Render      Runs the secure CMS backend for admin editing.
```

Think of it like this:

```txt
Vercel      = the public school building visitors see
Supabase    = the record room
Cloudinary  = the photo and document cupboard
Render      = the admin office
GitHub      = the master file cabinet
```

## Step 1: Stop Firebase

Do not continue any Firebase steps.

Do not run:

```txt
firebase deploy
firebase login
npm install -g firebase-tools
```

The Firebase files have been removed from this project.

## Step 2: Create A GitHub Account

1. Open your browser.
2. Go to `https://github.com`.
3. Click `Sign up`.
4. Type your email address.
5. Create a password.
6. Create a username.
7. Verify your email if GitHub asks.
8. Keep this account. We will use it to connect Vercel and Render.

## Step 3: Create A Vercel Account

1. Open `https://vercel.com`.
2. Click `Sign Up`.
3. Choose `Continue with GitHub`.
4. GitHub may ask permission. Click `Authorize Vercel`.
5. Choose the free `Hobby` plan if asked.
6. Do not add payment details unless you personally decide to later.

Vercel will host the public website.

Example free website address:

```txt
kankai-secondary-school.vercel.app
```

## Step 4: Create A Supabase Account

1. Open `https://supabase.com`.
2. Click `Start your project` or `Sign in`.
3. Choose `Continue with GitHub` if available.
4. After login, click `New project`.
5. For organization, use your name or school name.
6. For project name, type:

```txt
kankai-secondary-school
```

7. Create a strong database password.
8. Write the password somewhere private.
9. Choose a nearby region, such as Singapore or Mumbai if shown.
10. Click `Create new project`.
11. Wait until Supabase finishes creating it.

Supabase will store website content, CMS users, notices, events, translations and results.

## Step 5: Save Supabase Connection Details

Inside Supabase:

1. Open your project.
2. Look for `Project Settings`.
3. Open `API`.
4. Copy these values into a private note:

```txt
Project URL
anon public key
service_role key
```

Important:

```txt
anon public key      = can be used by public website
service_role key    = private; only Render backend should use it
```

Never paste the `service_role key` into public HTML or JavaScript files.

## Step 6: Create A Cloudinary Account

1. Open `https://cloudinary.com`.
2. Click `Sign up for free`.
3. Create your account.
4. After login, open the Cloudinary dashboard.
5. Copy these values into a private note:

```txt
Cloud name
API key
API secret
```

Important:

```txt
API key     = semi-public identifier
API secret  = private password for uploads
```

Never put `API secret` inside public website files.

Cloudinary will store:

```txt
Logo
Hero images
Gallery images
Teacher photos
PDF notices
Prospectus files
Downloadable documents
Favicons
```

## Step 7: Create A Render Account

1. Open `https://render.com`.
2. Click `Get Started` or `Sign Up`.
3. Choose `Continue with GitHub`.
4. Allow Render to connect to GitHub.
5. Use the free option for now.

Render will run the CMS backend.

Important:

Free Render services can sleep when nobody uses them. The admin panel may take a little time to open after sleeping. This does not mean the public website is broken.

## Step 8: Put The Website Into GitHub

This step uploads the project files to GitHub.

The folder you will use is:

```txt
C:\Users\Vishal\Documents\Codex\2026-07-02\files-mentioned-by-the-user-you\outputs\kankai-secondary-school-modern
```

Beginner method:

1. Open `https://github.com`.
2. Click the `+` button near the top right.
3. Click `New repository`.
4. Repository name:

```txt
kankai-secondary-school-modern
```

5. Choose `Private` at first.
6. Click `Create repository`.
7. GitHub will show upload instructions.

If you want, ask Codex to help with the upload commands when you reach this screen.

## Step 9: Deploy Public Website On Vercel

1. Open `https://vercel.com/dashboard`.
2. Click `Add New`.
3. Click `Project`.
4. Choose your GitHub repository:

```txt
kankai-secondary-school-modern
```

5. Click `Import`.
6. For framework, choose `Other` if Vercel asks.
7. Leave build command empty for the static website.
8. Leave output directory as the project root unless we later move files.
9. Click `Deploy`.

After deployment, Vercel gives a website address.

Example:

```txt
https://kankai-secondary-school-modern.vercel.app
```

## Step 10: Prepare The CMS Backend On Render

Render will need private environment variables.

Environment variables are secret settings. They are like private keys written inside Render, not inside public website files.

The CMS backend will need values like:

```txt
DATABASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
SESSION_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
```

Do not share these publicly.

## Step 11: What Happens After Setup

When the CMS is connected:

1. You open the hidden admin login page.
2. You log in with your administrator email and password.
3. Render verifies the login securely.
4. Text changes are saved in Supabase.
5. Images and PDFs are uploaded to Cloudinary.
6. Public website pages show only published content.
7. Draft content remains hidden from visitors.

## Step 12: Security Rules For You

Follow these rules:

1. Never share private keys.
2. Never paste `service_role key` into public website code.
3. Never paste `Cloudinary API secret` into public website code.
4. Use a strong admin password.
5. Do not reuse your personal email password.
6. Create separate admin users for other people.
7. Give editor access only to trusted staff.
8. Keep backup files private.

## Step 13: What To Tell Codex Next

After accounts are ready, tell Codex:

```txt
I created GitHub, Vercel, Supabase, Cloudinary and Render accounts. Continue with GitHub upload.
```

Then continue slowly, one screen at a time.
