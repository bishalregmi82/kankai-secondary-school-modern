# Secure CMS And Admin Guide

This file explains the CMS and security setup in plain language.

## What Was Added Or Modified

- `kss-secure-cms-gate-83.html`
  - Hidden admin login page.
  - It is not linked from the public website.
  - It includes `noindex,nofollow` so search engines should not index it.

- `cms-auth.js`
  - Static preview guard for admin access.
  - Redirects unauthenticated users away from `admin.html`.
  - Demonstrates login attempts, temporary lockout, session timeout, logout and audit records.
  - In production, this logic must run on the server with HTTP-only cookies.

- `admin.html`
  - Protected dashboard preview.
  - Includes `noindex,nofollow`.
  - Adds panels for content, pages, sections, menus, notices, media, SEO, users, audit logs, backups and security.

- `app.js`
  - Powers the CMS preview panels.
  - Keeps public pages working.
  - Keeps multilingual editing and translation status.

- `schema.prisma`
  - Adds backend-ready tables for users, roles, sessions, login attempts, pages, sections, menus, content revisions, uploads, backups, restores, audit logs and multilingual translations.

- `production-cms/`
  - Adds the production Express/TypeScript CMS API scaffold.
  - Includes authentication, protected admin routes, content editing, media upload, page/section/menu management, notices, gallery, contact, SEO, users, backups, seed roles, Docker, PM2 and Nginx files.

- Public HTML pages
  - Public admin links were removed.
  - Visitors no longer see admin access in the website navigation or footer.

## Preview Login

Open this hidden local file:

`kss-secure-cms-gate-83.html`

Preview credentials:

- Email: `vishalregmi82@gmail.com`
- Password: `ChangeMe!2083`
- Optional 2FA code: `123456`

This is only a local preview. For a real deployment, change the password immediately and use server-side authentication.

## How The CMS Works

Think of the website as two layers:

1. Public website
   - Visitors see normal pages.
   - They do not see edit buttons or admin links.

2. Protected CMS
   - Staff sign in through the hidden URL.
   - They can edit text, notices, pages, sections, menus, images, files and SEO.
   - Every change creates a revision and audit log in the production database.

## Updating Any Content

1. Sign in to the CMS.
2. Open `Content`.
3. Choose the language tab.
4. Edit the field.
5. Save draft or publish.

Use `Pages` for full pages, `Sections` for homepage/page blocks, `Menus` for navigation/footer labels, and `Media` for images/files.

## Autosave And Version History

While editing, the CMS autosaves drafts in the background.

To restore an older version:

1. Open the content item.
2. Click Version History.
3. Compare old and new text.
4. Click Restore.
5. Review the restored draft.
6. Publish when ready.

## Managing Images And Files

1. Open Media.
2. Upload an image, PDF or document.
3. Preview it.
4. Replace or delete it if needed.
5. Add alt text, captions and language variants.

Production upload protection checks file type, file size, storage path and audit logs the upload.

## Managing Notices, Gallery, Contact And SEO

- Notices: create, edit, delete, pin, schedule and expire.
- Gallery: create albums, upload multiple images, reorder images and add captions.
- Contact: edit address, phone, email, map, office hours and social links.
- SEO: edit page titles, descriptions, Open Graph images, canonical URLs and robots settings.

## Creating Another Administrator

1. Sign in as Owner.
2. Open `Users`.
3. Click Add User.
4. Enter their name and email.
5. Choose a role.
6. Send password setup link.

Recommended roles:

- Owner: full access.
- Administrator: most CMS work.
- Editor: content editing.
- Viewer: read-only access.

## Changing Passwords

1. Sign in.
2. Open user profile or Users.
3. Choose Change Password.
4. Enter the new password.
5. The system logs the change in the audit log.

Production passwords must be hashed with Argon2. If unavailable, use bcrypt.

## Restoring Backups

1. Open `Backups`.
2. Pick a backup date.
3. Confirm restore.
4. The system restores database content and uploaded media.
5. The restore action is logged.

Recommended schedule:

- Database: daily.
- Uploaded media: daily incremental.
- Full backup: weekly.

## Deploying Securely

For production:

1. Use HTTPS.
2. Store sessions in secure HTTP-only cookies.
3. Enable CSRF protection.
4. Add rate limiting and lockout.
5. Add security headers with Helmet.
6. Block admin routes in robots.txt.
7. Protect all admin API endpoints on the server.
8. Validate uploads by file type, file size and virus scan.
9. Use Prisma queries to prevent SQL injection.
10. Escape output to prevent XSS.

## Inline Editing

When an administrator is authenticated, production can show edit controls on hover:

- Text: Edit
- Image: Replace Image
- Button: Edit Button
- Section: Edit Section

Visitors never receive these controls because the server only renders them for authenticated admin sessions.
