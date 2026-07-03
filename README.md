# Kankai Secondary School Modern Website

This deliverable is a runnable premium multi-page website concept for Kankai Secondary School, Surunga, Jhapa. Open `index.html` in a browser to view the About-focused homepage, then use the navigation to open the individual pages.

## What Is Included

- About-focused homepage with hero, animated counters, school introduction, history timeline and footer.
- Separate pages for Academics, Admission, Notices, Events, Faculty, Results and Admin.
- Faculty landing page with separate department pages for Basic ECD, Basic Level, Science, Education, Humanities and Management.
- CMS/admin experience mock with dashboard, notices, media library, SEO and role panels.
- Hidden admin login route and protected dashboard preview. Public pages do not link to admin access.
- Light/dark mode, English/Nepali title switch, notice search/filter, modal, forms, progress bar and print-ready notices.
- CMS-integrated multilingual system for English and Nepali with language-aware navigation, page content, notices, media, files, SEO model, publishing states and translation status.
- SEO basics with description, Open Graph and JSON-LD school schema.
- Accessibility basics: skip link, focus states, labels, reduced-motion support and responsive layout.

## Production Architecture

Recommended beginner implementation:

```txt
Vercel       Public website pages
Supabase     Database and admin user records
Render       Secure CMS backend
Cloudinary   Images, PDFs and documents
```

Use `BEGINNER_DEPLOYMENT_GUIDE.md` as the main deployment guide if you do not have a private domain.

Alternative PostgreSQL implementation:

```txt
apps/
  web/                 Next.js 15, React, TypeScript, Tailwind, shadcn/ui
  api/                 Node.js, Express, TypeScript, Prisma
packages/
  ui/                  Shared components, tokens, icons
  config/              ESLint, tsconfig, env validation
  db/                  Prisma schema, migrations, seed data
infra/
  docker/              Dockerfiles and compose
  nginx/               Reverse proxy, compression, caching
  pm2/                 Process configs
```

## PostgreSQL Data Model

This remains available for the Supabase/Render setup. Supabase uses PostgreSQL, so this schema is the database direction for the production CMS.

Core tables:

```prisma
model User { id String @id @default(cuid()) email String @unique passwordHash String roleId String role Role refreshTokens RefreshToken[] auditLogs AuditLog[] createdAt DateTime @default(now()) }
model Role { id String @id @default(cuid()) name String @unique users User[] permissions Permission[] }
model Permission { id String @id @default(cuid()) action String subject String roles Role[] }
model RefreshToken { id String @id @default(cuid()) tokenHash String userId String user User @relation(fields:[userId], references:[id]) expiresAt DateTime revokedAt DateTime? }
model Notice { id String @id @default(cuid()) title String slug String @unique body String category String pinned Boolean @default(false) publishAt DateTime expireAt DateTime? attachments Media[] createdAt DateTime @default(now()) }
model Event { id String @id @default(cuid()) title String slug String @unique body String startsAt DateTime endsAt DateTime? gallery Album? }
model Album { id String @id @default(cuid()) title String slug String @unique media Media[] }
model Media { id String @id @default(cuid()) url String publicId String type String alt String? tags String[] notices Notice[] albumId String? album Album? }
model Teacher { id String @id @default(cuid()) name String qualification String experience String subject String email String? departmentId String department Department @relation(fields:[departmentId], references:[id]) photoId String? }
model Department { id String @id @default(cuid()) name String teachers Teacher[] }
model Admission { id String @id @default(cuid()) studentName String className String guardianPhone String status String @default("NEW") createdAt DateTime @default(now()) }
model Result { id String @id @default(cuid()) studentId String symbolNumber String className String gpa Float remarks String published Boolean @default(false) }
model Download { id String @id @default(cuid()) title String category String fileId String file Media @relation(fields:[fileId], references:[id]) }
model Message { id String @id @default(cuid()) name String email String body String createdAt DateTime @default(now()) }
model Testimonial { id String @id @default(cuid()) name String role String quote String photoId String? }
model Achievement { id String @id @default(cuid()) title String year Int body String }
model Facility { id String @id @default(cuid()) title String body String icon String photoId String? }
model Setting { id String @id @default(cuid()) key String @unique value Json }
model Seo { id String @id @default(cuid()) path String @unique title String description String ogImage String? schema Json? }
model AuditLog { id String @id @default(cuid()) userId String user User @relation(fields:[userId], references:[id]) action String entity String entityId String? createdAt DateTime @default(now()) }
```

## Security And Operations

- JWT access tokens plus hashed refresh tokens in secure cookies.
- Helmet, CSRF protection, rate limiting, input validation with Zod and Prisma parameterization.
- Cloudinary signed uploads, MIME checks, image compression and moderation queue.
- Daily PostgreSQL backup, audit logs, PM2 process supervision and Nginx caching.
- Dynamic sitemap, robots, canonical URLs, Open Graph, Twitter cards and JSON-LD.

## Content Notes

The concept adapts public factual context from the existing school site and public Surunga/Kankai references: school name, Surunga/Jhapa location, public-school positioning, approximate learner scale, inclusive education note, and local education context. Staff names, CMS records and photos are sample production seeds that should be replaced during real migration.

## Multilingual CMS

See `MULTILINGUAL_CMS.md` for how to edit translations, add new languages, publish one language independently, replace language-specific images/PDFs, manage missing translations and restore previous translated versions.

## Secure CMS

See `CMS_SECURITY_AND_OPERATIONS.md` for the hidden login URL, preview credentials, admin workflow, deployment notes, user management, password changes, backups, restores and security controls.
