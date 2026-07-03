# Production CMS API Scaffold

This folder contains the production backend scaffold for the Kankai Secondary School CMS. It preserves the existing public website and adds secure admin APIs behind protected routes.

## Security Included

- Argon2id password hashing with bcrypt fallback.
- Secure signed HTTP-only session cookie.
- Separate readable CSRF cookie and required `x-csrf-token` header for writes.
- Session regeneration after login by revoking previous sessions and issuing a new session.
- 30-minute session timeout.
- Logout route that revokes the session.
- Login rate limiting.
- Temporary user lockout after repeated failed login attempts.
- Generic login errors.
- 2FA-ready user field.
- Helmet security headers, including clickjacking protection.
- RBAC permission middleware.
- Audit log writes for login, logout, content edits, uploads and backups.
- Upload validation by MIME type and file size.
- Cloudinary storage for images, PDFs and documents.
- Dedicated protected APIs for notices, gallery albums, contact details, SEO, users, pages, sections, menus, media, backups, autosave and revision restore.

## Running Locally

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL`, `SESSION_SECRET` and Cloudinary values.
3. Install dependencies with `npm install`.
4. Copy the root `schema.prisma` into `production-cms/prisma/schema.prisma` before creating migrations.
5. Run migrations.
6. Run `npm run seed` to create default roles and the first owner account.
7. Start the API with `npm run dev`.

## Admin Route

The public website does not link to admin. The hidden login route should be configured from `ADMIN_LOGIN_PATH`.

## Public Performance

The public site remains static and fast. CMS APIs are loaded only for authenticated admin workflows.

## Deployment Files

- `Dockerfile` builds the CMS API.
- `docker-compose.yml` starts PostgreSQL and the CMS API.
- `ecosystem.config.cjs` runs the API with PM2.
- `nginx.conf` proxies API/admin traffic and serves the public static website.

## Render Settings

Use these values when creating the Render web service:

```txt
Root Directory: production-cms
Build Command: npm install && npm run render:build
Start Command: npm start
```

Required Render environment variables:

```txt
NODE_ENV=production
DATABASE_URL=your Supabase database URL
SESSION_SECRET=a long private random text
SESSION_COOKIE_NAME=kss_admin_session
CSRF_COOKIE_NAME=kss_csrf
ADMIN_LOGIN_PATH=/kss-secure-cms-gate-83
ADMIN_EMAIL=vishalregmi82@gmail.com
ADMIN_PASSWORD=your first private admin password
CLOUDINARY_CLOUD_NAME=your Cloudinary cloud name
CLOUDINARY_API_KEY=your Cloudinary API key
CLOUDINARY_API_SECRET=your Cloudinary API secret
CLOUDINARY_FOLDER=kankai-secondary-school
```

## API Areas

- `/api/auth`: login and logout.
- `/api/admin/content`: universal text/content editing, autosave, version history and restore.
- `/api/admin/media`: image/PDF upload and media records.
- `/api/admin/site`: pages, sections and menus.
- `/api/admin/notices`: create, edit, delete, pin, schedule and expire notices.
- `/api/admin/gallery`: albums and gallery organization.
- `/api/admin/contact`: address, phone, email, map, hours and social links.
- `/api/admin/seo`: page titles, descriptions, Open Graph and robots settings.
- `/api/admin/users`: Owner, Administrator, Editor and Viewer accounts.
- `/api/admin/backups`: manual backups and restore jobs.
