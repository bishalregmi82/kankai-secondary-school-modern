import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const galleryRouter = express.Router();
galleryRouter.use(requireAdmin);

const albumSchema = z.object({
  title: z.string().min(1).max(180),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional()
});

galleryRouter.get("/albums", requirePermission("read", "gallery"), async (_req, res) => {
  const albums = await prisma.album.findMany({ include: { media: true }, orderBy: { createdAt: "desc" } });
  res.json({ albums });
});

galleryRouter.post("/albums", requireCsrf, requirePermission("create", "gallery"), async (req, res) => {
  const album = await prisma.album.create({ data: albumSchema.parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "album_create", entity: "Album", entityId: album.id } });
  res.json({ album });
});

galleryRouter.delete("/albums/:id", requireCsrf, requirePermission("delete", "gallery"), async (req, res) => {
  await prisma.album.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "album_delete", entity: "Album", entityId: req.params.id } });
  res.json({ ok: true });
});
