import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const seoRouter = express.Router();
seoRouter.use(requireAdmin);

const seoSchema = z.object({
  path: z.string().min(1).max(260),
  title: z.string().min(1).max(180),
  description: z.string().max(500),
  ogImage: z.string().url().optional(),
  schema: z.record(z.unknown()).optional()
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
