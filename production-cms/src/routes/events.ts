import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const eventRouter = express.Router();
export const publicEventRouter = express.Router();

const eventSchema = z.object({
  title: z.string().min(1).max(240),
  slug: z.string().min(1).max(260).regex(/^[a-z0-9-]+$/),
  body: z.string().max(50000),
  category: z.string().min(1).max(120),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional()
});

publicEventRouter.get("/", async (_req, res) => {
  const events = await prisma.event.findMany({
    include: { album: { include: { media: true } } },
    orderBy: { startsAt: "desc" },
    take: 50
  });
  res.json({ events });
});

eventRouter.use(requireAdmin);

eventRouter.get("/", requirePermission("read", "event"), async (_req, res) => {
  const events = await prisma.event.findMany({
    include: { album: { include: { media: true } } },
    orderBy: { startsAt: "desc" }
  });
  res.json({ events });
});

eventRouter.post("/", requireCsrf, requirePermission("create", "event"), async (req, res) => {
  const event = await prisma.event.create({ data: eventSchema.parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "event_create", entity: "Event", entityId: event.id } });
  res.json({ event });
});

eventRouter.put("/:id", requireCsrf, requirePermission("update", "event"), async (req, res) => {
  const event = await prisma.event.update({ where: { id: req.params.id }, data: eventSchema.partial().parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "event_update", entity: "Event", entityId: event.id } });
  res.json({ event });
});

eventRouter.delete("/:id", requireCsrf, requirePermission("delete", "event"), async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "event_delete", entity: "Event", entityId: req.params.id } });
  res.json({ ok: true });
});
