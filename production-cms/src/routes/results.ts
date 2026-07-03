import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const resultRouter = express.Router();
export const publicResultRouter = express.Router();

const resultSchema = z.object({
  studentId: z.string().min(1).max(120),
  symbolNumber: z.string().min(1).max(120),
  studentName: z.string().min(1).max(180),
  className: z.string().min(1).max(120),
  gpa: z.coerce.number().min(0).max(4),
  remarks: z.string().max(500),
  published: z.boolean().default(false)
});

publicResultRouter.get("/lookup", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.status(400).json({ error: "Result details required" });
  const result = await prisma.result.findFirst({
    where: {
      published: true,
      OR: [{ studentId: query }, { symbolNumber: query }]
    },
    select: { studentId: true, symbolNumber: true, studentName: true, className: true, gpa: true, remarks: true }
  });
  if (!result) return res.status(404).json({ error: "Result not found" });
  res.json({ result });
});

resultRouter.use(requireAdmin);

resultRouter.get("/", requirePermission("read", "result"), async (_req, res) => {
  const results = await prisma.result.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
  res.json({ results });
});

resultRouter.post("/", requireCsrf, requirePermission("create", "result"), async (req, res) => {
  const result = await prisma.result.create({ data: resultSchema.parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "result_create", entity: "Result", entityId: result.id } });
  res.json({ result });
});

resultRouter.put("/:id", requireCsrf, requirePermission("update", "result"), async (req, res) => {
  const result = await prisma.result.update({ where: { id: req.params.id }, data: resultSchema.partial().parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "result_update", entity: "Result", entityId: result.id } });
  res.json({ result });
});

resultRouter.delete("/:id", requireCsrf, requirePermission("delete", "result"), async (req, res) => {
  await prisma.result.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "result_delete", entity: "Result", entityId: req.params.id } });
  res.json({ ok: true });
});
