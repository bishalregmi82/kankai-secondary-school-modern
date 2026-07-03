import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const facultyRouter = express.Router();
export const publicFacultyRouter = express.Router();

const departmentSchema = z.object({
  name: z.string().min(1).max(160)
});

const teacherSchema = z.object({
  name: z.string().min(1).max(180),
  qualification: z.string().max(240),
  experience: z.string().max(160),
  subject: z.string().max(180),
  email: z.string().email().optional().or(z.literal("")),
  departmentId: z.string().min(1),
  photoUrl: z.string().url().optional().or(z.literal(""))
});

publicFacultyRouter.get("/", async (_req, res) => {
  const departments = await prisma.department.findMany({
    include: { teachers: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" }
  });
  res.json({ departments });
});

facultyRouter.use(requireAdmin);

facultyRouter.get("/", requirePermission("read", "faculty"), async (_req, res) => {
  const departments = await prisma.department.findMany({
    include: { teachers: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" }
  });
  res.json({ departments });
});

facultyRouter.post("/departments", requireCsrf, requirePermission("create", "faculty"), async (req, res) => {
  const department = await prisma.department.create({ data: departmentSchema.parse(req.body) });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "department_create", entity: "Department", entityId: department.id } });
  res.json({ department });
});

facultyRouter.post("/teachers", requireCsrf, requirePermission("create", "faculty"), async (req, res) => {
  const input = teacherSchema.parse(req.body);
  const teacher = await prisma.teacher.create({ data: { ...input, email: input.email || null, photoUrl: input.photoUrl || null } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "teacher_create", entity: "Teacher", entityId: teacher.id } });
  res.json({ teacher });
});

facultyRouter.put("/teachers/:id", requireCsrf, requirePermission("update", "faculty"), async (req, res) => {
  const input = teacherSchema.partial().parse(req.body);
  const teacher = await prisma.teacher.update({ where: { id: req.params.id }, data: { ...input, email: input.email || undefined, photoUrl: input.photoUrl || undefined } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "teacher_update", entity: "Teacher", entityId: teacher.id } });
  res.json({ teacher });
});

facultyRouter.delete("/teachers/:id", requireCsrf, requirePermission("delete", "faculty"), async (req, res) => {
  await prisma.teacher.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "teacher_delete", entity: "Teacher", entityId: req.params.id } });
  res.json({ ok: true });
});
