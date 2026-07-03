import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const noticeRouter = express.Router();
noticeRouter.use(requireAdmin);

const noticeSchema = z.object({
  title: z.string().min(1).max(240),
  slug: z.string().min(1).max(260).regex(/^[a-z0-9-]+$/),
  body: z.string().max(50000),
  category: z.string().min(1).max(120),
  pinned: z.boolean().default(false),
  publishAt: z.coerce.date(),
  expireAt: z.coerce.date().optional()
});

noticeRouter.get("/", requirePermission("read", "notice"), async (_req, res) => {
  const notices = await prisma.notice.findMany({
    include: { translations: { include: { language: true } }, attachments: true },
    orderBy: [{ pinned: "desc" }, { publishAt: "desc" }]
  });
  res.json({ notices });
});

noticeRouter.post("/", requireCsrf, requirePermission("create", "notice"), async (req, res) => {
  const input = noticeSchema.parse(req.body);
  const notice = await prisma.notice.create({ data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_create", entity: "Notice", entityId: notice.id } });
  res.json({ notice });
});

noticeRouter.put("/:id", requireCsrf, requirePermission("update", "notice"), async (req, res) => {
  const input = noticeSchema.partial().parse(req.body);
  const notice = await prisma.notice.update({ where: { id: req.params.id }, data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_update", entity: "Notice", entityId: notice.id } });
  res.json({ notice });
});

noticeRouter.delete("/:id", requireCsrf, requirePermission("delete", "notice"), async (req, res) => {
  await prisma.notice.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "notice_delete", entity: "Notice", entityId: req.params.id } });
  res.json({ ok: true });
});
