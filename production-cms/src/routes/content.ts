import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const contentRouter = express.Router();
export const publicContentRouter = express.Router();
contentRouter.use(requireAdmin);

const translationSchema = z.object({
  key: z.string().min(1).max(180),
  languageId: z.string().min(1).optional(),
  languageCode: z.string().min(2).max(12).optional(),
  value: z.string().max(20000),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"])
});

async function languageIdFromInput(languageId?: string, languageCode = "en") {
  if (languageId) return languageId;
  const language = await prisma.language.upsert({
    where: { code: languageCode.toLowerCase() },
    update: { isEnabled: true },
    create: {
      code: languageCode.toLowerCase(),
      name: languageCode.toUpperCase(),
      nativeName: languageCode.toUpperCase(),
      isDefault: languageCode.toLowerCase() === "en",
      isEnabled: true,
      publicState: "PUBLISHED"
    }
  });
  return language.id;
}

publicContentRouter.get("/", async (req, res) => {
  const languageCode = String(req.query.lang || "en").toLowerCase();
  const pagePath = req.query.path ? String(req.query.path) : undefined;
  const items = await prisma.contentItem.findMany({
    where: pagePath ? { OR: [{ pagePath }, { pagePath: null }] } : undefined,
    include: { translations: { include: { language: true } } }
  });

  const content = Object.fromEntries(items.map((item) => {
    const current = item.translations.find((translation) => translation.language.code === languageCode && translation.status === "PUBLISHED");
    const fallback = item.translations.find((translation) => translation.language.code === "en" && translation.status === "PUBLISHED");
    return [item.key, current?.value || fallback?.value || item.fallbackValue || ""];
  }));

  res.json({ content });
});

contentRouter.get("/languages", requirePermission("read", "content"), async (_req, res) => {
  const languages = await prisma.language.findMany({ orderBy: [{ isDefault: "desc" }, { code: "asc" }] });
  res.json({ languages });
});

contentRouter.get("/", requirePermission("read", "content"), async (_req, res) => {
  const items = await prisma.contentItem.findMany({
    include: { translations: { include: { language: true } } },
    orderBy: { key: "asc" },
    take: 200
  });
  res.json({ items });
});

contentRouter.put("/translation", requireCsrf, requirePermission("update", "content"), async (req, res) => {
  const input = translationSchema.parse(req.body);
  const languageId = await languageIdFromInput(input.languageId, input.languageCode);
  const item = await prisma.contentItem.upsert({
    where: { key: input.key },
    create: { key: input.key, contentType: "text" },
    update: {}
  });

  const existing = await prisma.contentTranslation.findUnique({
    where: { itemId_languageId: { itemId: item.id, languageId } }
  });

  const translation = await prisma.contentTranslation.upsert({
    where: { itemId_languageId: { itemId: item.id, languageId } },
    create: { itemId: item.id, languageId, value: input.value, status: input.status },
    update: { value: input.value, status: input.status }
  });

  await prisma.contentRevision.create({
    data: {
      itemId: item.id,
      languageCode: input.languageCode || languageId,
      oldValue: existing?.value,
      newValue: input.value,
      changedBy: res.locals.user.id
    }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "content_update", entity: "ContentItem", entityId: item.id } });
  res.json({ translation });
});

contentRouter.post("/autosave", requireCsrf, requirePermission("update", "content"), async (req, res) => {
  const input = translationSchema.omit({ status: true }).parse(req.body);
  const languageId = await languageIdFromInput(input.languageId, input.languageCode);
  const item = await prisma.contentItem.upsert({
    where: { key: input.key },
    create: { key: input.key, contentType: "text" },
    update: {}
  });
  const draft = await prisma.contentTranslation.upsert({
    where: { itemId_languageId: { itemId: item.id, languageId } },
    create: { itemId: item.id, languageId, value: input.value, status: "DRAFT" },
    update: { value: input.value, status: "DRAFT" }
  });
  res.json({ draft, autosavedAt: new Date().toISOString() });
});

contentRouter.get("/:itemId/revisions", requirePermission("read", "content"), async (req, res) => {
  const revisions = await prisma.contentRevision.findMany({
    where: { itemId: req.params.itemId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ revisions });
});

contentRouter.post("/revisions/:revisionId/restore", requireCsrf, requirePermission("update", "content"), async (req, res) => {
  const revision = await prisma.contentRevision.findUniqueOrThrow({ where: { id: req.params.revisionId } });
  const restored = await prisma.contentTranslation.updateMany({
    where: { itemId: revision.itemId, languageId: revision.languageCode },
    data: { value: revision.oldValue || revision.newValue, status: "DRAFT" }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "revision_restore", entity: "ContentRevision", entityId: revision.id } });
  res.json({ restored });
});
