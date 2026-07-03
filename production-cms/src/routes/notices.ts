import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const noticeRouter = express.Router();
export const publicNoticeRouter = express.Router();

const publishStates = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] as const;

const translationSchema = z.object({
  languageCode: z.string().min(2).max(12).regex(/^[a-z]{2,3}(-[a-z0-9]+)?$/i),
  title: z.string().min(1).max(240),
  body: z.string().max(50000),
  category: z.string().min(1).max(120),
  status: z.enum(publishStates).default("DRAFT"),
  publishAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  archivedAt: z.coerce.date().optional()
});

const noticeSchema = z.object({
  title: z.string().min(1).max(240),
  slug: z.string().min(1).max(260).regex(/^[a-z0-9-]+$/),
  body: z.string().max(50000),
  category: z.string().min(1).max(120),
  pinned: z.boolean().default(false),
  publishAt: z.coerce.date(),
  expireAt: z.coerce.date().optional(),
  translations: z.array(translationSchema).optional()
});

function toPublicNotice(notice: any, languageCode: string) {
  const translations = notice.translations || [];
  const current = translations.find((item: any) => item.language.code === languageCode && item.status === "PUBLISHED");
  const fallback = translations.find((item: any) => item.language.code === "en" && item.status === "PUBLISHED");
  const translation = current || fallback;

  if (!translation && languageCode !== "en") return null;

  return {
    id: notice.id,
    slug: notice.slug,
    title: translation?.title || notice.title,
    body: translation?.body || notice.body,
    category: translation?.category || notice.category,
    pinned: notice.pinned,
    publishAt: translation?.publishAt || notice.publishAt,
    expireAt: notice.expireAt,
    language: translation?.language?.code || "en"
  };
}

async function saveTranslations(tx: any, noticeId: string, translations = [] as z.infer<typeof translationSchema>[]) {
  for (const translation of translations) {
    const language = await tx.language.upsert({
      where: { code: translation.languageCode.toLowerCase() },
      update: { isEnabled: true },
      create: {
        code: translation.languageCode.toLowerCase(),
        name: translation.languageCode.toUpperCase(),
        nativeName: translation.languageCode.toUpperCase(),
        isDefault: translation.languageCode.toLowerCase() === "en",
        isEnabled: true,
        publicState: "PUBLISHED"
      }
    });

    await tx.noticeTranslation.upsert({
      where: { noticeId_languageId: { noticeId, languageId: language.id } },
      update: {
        title: translation.title,
        body: translation.body,
        category: translation.category,
        status: translation.status,
        publishAt: translation.publishAt,
        scheduledAt: translation.scheduledAt,
        archivedAt: translation.archivedAt
      },
      create: {
        noticeId,
        languageId: language.id,
        title: translation.title,
        body: translation.body,
        category: translation.category,
        status: translation.status,
        publishAt: translation.publishAt,
        scheduledAt: translation.scheduledAt,
        archivedAt: translation.archivedAt
      }
    });
  }
}

publicNoticeRouter.get("/", async (req, res) => {
  const languageCode = String(req.query.lang || "en").toLowerCase();
  const now = new Date();
  const notices = await prisma.notice.findMany({
    where: {
      publishAt: { lte: now },
      OR: [{ expireAt: null }, { expireAt: { gt: now } }]
    },
    include: { translations: { include: { language: true } }, attachments: true },
    orderBy: [{ pinned: "desc" }, { publishAt: "desc" }]
  });

  res.json({ notices: notices.map((notice) => toPublicNotice(notice, languageCode)).filter(Boolean) });
});

noticeRouter.use(requireAdmin);

noticeRouter.get("/", requirePermission("read", "notice"), async (_req, res) => {
  const notices = await prisma.notice.findMany({
    include: { translations: { include: { language: true } }, attachments: true },
    orderBy: [{ pinned: "desc" }, { publishAt: "desc" }]
  });
  res.json({ notices });
});

noticeRouter.post("/", requireCsrf, requirePermission("create", "notice"), async (req, res) => {
  const input = noticeSchema.parse(req.body);
  const { translations, ...noticeInput } = input;
  const notice = await prisma.$transaction(async (tx) => {
    const created = await tx.notice.create({ data: noticeInput });
    await saveTranslations(tx, created.id, translations);
    return tx.notice.findUniqueOrThrow({
      where: { id: created.id },
      include: { translations: { include: { language: true } }, attachments: true }
    });
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_create", entity: "Notice", entityId: notice.id } });
  res.json({ notice });
});

noticeRouter.put("/:id", requireCsrf, requirePermission("update", "notice"), async (req, res) => {
  const input = noticeSchema.partial().parse(req.body);
  const { translations, ...noticeInput } = input;
  const notice = await prisma.$transaction(async (tx) => {
    await tx.notice.update({ where: { id: req.params.id }, data: noticeInput });
    await saveTranslations(tx, req.params.id, translations);
    return tx.notice.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { translations: { include: { language: true } }, attachments: true }
    });
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_update", entity: "Notice", entityId: notice.id } });
  res.json({ notice });
});

noticeRouter.delete("/:id", requireCsrf, requirePermission("delete", "notice"), async (req, res) => {
  await prisma.notice.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_delete", entity: "Notice", entityId: req.params.id } });
  res.json({ ok: true });
});
