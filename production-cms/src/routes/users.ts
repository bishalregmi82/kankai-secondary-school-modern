import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";
import { hashPassword } from "../security/password.js";

export const userRouter = express.Router();
userRouter.use(requireAdmin);

const createUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(180),
  password: z.string().min(12).max(200),
  roleId: z.string().min(1)
});

userRouter.get("/", requirePermission("read", "user"), async (_req, res) => {
  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: "desc" } });
  res.json({ users: users.map(({ passwordHash: _passwordHash, twoFactorSecret: _twoFactorSecret, ...user }) => user) });
});

userRouter.post("/", requireCsrf, requirePermission("create", "user"), async (req, res) => {
  const input = createUserSchema.parse(req.body);
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: await hashPassword(input.password),
      roleId: input.roleId
    }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "user_create", entity: "User", entityId: user.id } });
  res.json({ user: { id: user.id, email: user.email, name: user.name, roleId: user.roleId } });
});

userRouter.put("/:id/password", requireCsrf, requirePermission("update", "user"), async (req, res) => {
  const password = z.object({ password: z.string().min(12).max(200) }).parse(req.body).password;
  await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: await hashPassword(password) } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "password_change", entity: "User", entityId: req.params.id } });
  res.json({ ok: true });
});
