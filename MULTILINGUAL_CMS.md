# Multilingual CMS Guide

This project now includes a CMS-ready multilingual model for English and Nepali, designed so more languages can be added later without redesigning the website.

## What Changed

- `app.js`
  - Connects the existing language switcher to CMS language data.
  - Saves the visitor language in the browser.
  - Changes navigation labels, major page headings, homepage content, footer text, notices, hero image and image alt text by language.
  - Searches notices only in the active language.
  - Hides notice translations that are not published for the active language.
  - Adds admin language tabs, translation progress, missing translation warnings, language-aware media and file examples.

- `styles.css`
  - Adds styling for admin language tabs only.
  - Does not redesign the public website.

- `schema.prisma`
  - Adds `Language`, `ContentItem`, `ContentTranslation`, `ContentRevision`, `NoticeTranslation`, `DownloadTranslation`, `SeoTranslation`, `MediaVariant` and translation settings.
  - Adds independent language publishing states: `DRAFT`, `PUBLISHED`, `SCHEDULED`, `ARCHIVED`.

## Editing Content In Each Language

1. Open the hidden/protected admin dashboard in the production CMS.
2. Choose the area you want to edit, such as Homepage, Notices, Media or SEO.
3. Use the language tabs, for example `English` or `Nepali`.
4. Edit only the content for that language.
5. Save draft or publish that language.

Publishing English does not publish Nepali. Each language has its own status.

## Adding A New Language

1. Go to CMS Settings.
2. Add a language code, such as `hi`, `ja`, or `fr`.
3. Enter its name and text direction.
4. Set it to Draft while translating.
5. Translate pages, navigation, notices, files, SEO and media alt text.
6. Publish the language when ready.

The schema stores languages in the database, so the system is not hardcoded to only English and Nepali.

## Replacing Language-Specific Images

For each image, choose one mode:

- Use one image for all languages.
- Use a separate image for each language.

Example:

- English hero image: `hero-en.jpg`
- Nepali hero image: `hero-np.jpg`

The public site automatically uses the active language image. If no translation exists, the configured missing-translation behavior applies.

## Replacing Language-Specific PDFs

For downloads such as prospectus PDFs:

1. Open Downloads in the CMS.
2. Choose the language tab.
3. Upload or replace the PDF for that language.
4. Publish that language version.

Example:

- English prospectus: `prospectus-en.pdf`
- Nepali prospectus: `prospectus-np.pdf`

## Translation Status

The admin dashboard shows progress by area:

- Complete
- Missing translations
- Draft language content
- Published language content

Example:

- Homepage: Complete
- Notices: Missing 1 translation
- Media: Complete

## Missing Translation Behavior

The CMS supports four behaviors:

1. Show English fallback.
2. Show nothing.
3. Show a custom placeholder.
4. Mark missing translations inside the admin dashboard.

The preview uses English fallback by default.

## Language Visibility

Each language can be:

- Draft
- Published
- Scheduled
- Archived

Visitors only see content for languages marked as published.

## Language-Specific SEO

Each page can have separate SEO per language:

- SEO title
- Meta description
- Keywords
- Open Graph title
- Open Graph description
- Open Graph image
- Canonical URL

Recommended URL strategy:

- Keep existing English routes for compatibility, such as `/about`.
- Add language aliases for SEO, such as `/en/about` and `/np/about`.
- Use canonical URLs to prevent duplicate SEO issues.

## Restoring Previous Versions

Every translation edit should create a `ContentRevision` record.

To restore:

1. Open the content item.
2. Select the language tab.
3. Open Version History.
4. Compare old and new values.
5. Click Restore on the version you want.

## Security Notes For Production

The production CMS should keep admin routes hidden from public navigation, block indexing with `robots` and headers, protect all admin APIs, use secure HTTP-only cookies, Argon2 or bcrypt password hashing, CSRF protection, rate limiting, upload validation, audit logs and role-based permissions.
