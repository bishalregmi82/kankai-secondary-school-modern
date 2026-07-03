import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db.js";
import { createAdminSession, destroyAdminSession, requireAdmin } from "../security/session.js";
import { verifyPassword } from "../security/password.js";

export const authRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Invalid login details" }
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
  twoFactorCode: z.string().max(12).optional()
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid login details" });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  const genericError = { error: "Invalid login details" };

  if (!user || user.lockedUntil && user.lockedUntil > new Date()) {
    await prisma.loginAttempt.create({ data: { email, success: false, reason: "missing_or_locked", ipAddress: req.ip } });
    return res.status(401).json(genericError);
  }

  const passwordOk = await verifyPassword(user.passwordHash, parsed.data.password);
  const twoFactorOk = !user.twoFactorSecret || Boolean(parsed.data.twoFactorCode);

  if (!passwordOk || !twoFactorOk) {
    await prisma.loginAttempt.create({ data: { email, userId: user.id, success: false, reason: "bad_credentials", ipAddress: req.ip } });
    const recentFailures = await prisma.loginAttempt.count({
      where: { email, success: false, createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) } }
    });
    if (recentFailures >= 5) {
      await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000), isLocked: true } });
    }
    return res.status(401).json(genericError);
  }

  await prisma.adminSession.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  await createAdminSession(res, user.id, req.ip, req.header("user-agent"));
  await prisma.loginAttempt.create({ data: { email, userId: user.id, success: true, ipAddress: req.ip } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "login", entity: "AdminSession", ipAddress: req.ip } });
  res.json({ ok: true });
});

authRouter.get("/me", requireAdmin, async (_req, res) => {
  res.json({
    ok: true,
    user: {
      email: res.locals.user.email,
      name: res.locals.user.name,
      role: res.locals.user.role.name
    }
  });
});

authRouter.post("/logout", requireAdmin, async (req, res) => {
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "logout", entity: "AdminSession", ipAddress: req.ip } });
  await destroyAdminSession(req, res);
  res.json({ ok: true });
});
