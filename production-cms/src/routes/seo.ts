import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const seoRouter = express.Router();
export const publicSeoRouter = express.Router();
seoRouter.use(requireAdmin);

const seoSchema = z.object({
  path: z.string().min(1).max(260),
  title: z.string().min(1).max(180),
  description: z.string().max(500),
  ogImage: z.string().url().optional(),
  schema: z.record(z.unknown()).optional()
});

const seoTranslationSchema = seoSchema.extend({
  languageCode: z.string().min(2).max(12),
  keywords: z.array(z.string().max(80)).default([]),
  ogTitle: z.string().max(180).optional(),
  ogDescription: z.string().max(500).optional(),
  canonicalUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("PUBLISHED")
});

async function upsertLanguage(code: string) {
  return prisma.language.upsert({
    where: { code: code.toLowerCase() },
    update: { isEnabled: true },
    create: {
      code: code.toLowerCase(),
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      isDefault: code.toLowerCase() === "en",
      isEnabled: true,
      publicState: "PUBLISHED"
    }
  });
}

publicSeoRouter.get("/", async (req, res) => {
  const path = String(req.query.path || "/");
  const languageCode = String(req.query.lang || "en").toLowerCase();
  const record = await prisma.seo.findUnique({ where: { path }, include: { translations: { include: { language: true } } } });
  if (!record) return res.json({ seo: null });
  const current = record.translations.find((translation) => translation.language.code === languageCode && translation.status === "PUBLISHED");
  const fallback = record.translations.find((translation) => translation.language.code === "en" && translation.status === "PUBLISHED");
  const translation = current || fallback;
  res.json({
    seo: {
      path: record.path,
      title: translation?.title || record.title,
      description: translation?.description || record.description,
      keywords: translation?.keywords || [],
      ogTitle: translation?.ogTitle || translation?.title || record.title,
      ogDescription: translation?.ogDescription || translation?.description || record.description,
      ogImage: translation?.ogImage || record.ogImage,
      canonicalUrl: translation?.canonicalUrl
    }
  });
});

seoRouter.get("/", requirePermission("read", "seo"), async (_req, res) => {
  const records = await prisma.seo.findMany({ include: { translations: { include: { language: true } } } });
  res.json({ records });
});

seoRouter.put("/", requireCsrf, requirePermission("update", "seo"), async (req, res) => {
  const input = seoSchema.parse(req.body);
  const seo = await prisma.seo.upsert({
    where: { path: input.path },
    create: input,
    update: input
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "seo_update", entity: "Seo", entityId: seo.id } });
  res.json({ seo });
});

seoRouter.put("/translation", requireCsrf, requirePermission("update", "seo"), async (req, res) => {
  const input = seoTranslationSchema.parse(req.body);
  const language = await upsertLanguage(input.languageCode);
  const seo = await prisma.seo.upsert({
    where: { path: input.path },
    create: {
      path: input.path,
      title: input.title,
      description: input.description,
      ogImage: input.ogImage,
      schema: input.schema
    },
    update: {
      title: input.title,
      description: input.description,
      ogImage: input.ogImage,
      schema: input.schema
    }
  });
  const translation = await prisma.seoTranslation.upsert({
    where: { seoId_languageId: { seoId: seo.id, languageId: language.id } },
    create: {
      seoId: seo.id,
      languageId: language.id,
      title: input.title,
      description: input.description,
      keywords: input.keywords,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImage: input.ogImage,
      canonicalUrl: input.canonicalUrl,
      status: input.status
    },
    update: {
      title: input.title,
      description: input.description,
      keywords: input.keywords,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImage: input.ogImage,
      canonicalUrl: input.canonicalUrl,
      status: input.status
    }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "seo_translation_update", entity: "Seo", entityId: seo.id } });
  res.json({ seo, translation });
});
