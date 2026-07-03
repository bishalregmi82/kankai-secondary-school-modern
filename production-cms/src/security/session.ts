import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";

const cookieName = process.env.SESSION_COOKIE_NAME || "kss_admin_session";
const sessionMs = 30 * 60 * 1000;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createAdminSession(res: Response, userId: string, ip?: string, userAgent?: string) {
  const rawSession = crypto.randomBytes(48).toString("base64url");
  const rawCsrf = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionMs);

  await prisma.adminSession.create({
    data: {
      userId,
      sessionHash: sha256(rawSession),
      csrfHash: sha256(rawCsrf),
      ipAddress: ip,
      userAgent,
      expiresAt
    }
  });

  res.cookie(cookieName, rawSession, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    signed: true,
    maxAge: sessionMs,
    path: "/"
  });

  res.cookie(process.env.CSRF_COOKIE_NAME || "kss_csrf", rawCsrf, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: sessionMs,
    path: "/"
  });
}

export async function destroyAdminSession(req: Request, res: Response) {
  const raw = req.signedCookies?.[cookieName];
  if (raw) {
    await prisma.adminSession.updateMany({
      where: { sessionHash: sha256(raw), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
  res.clearCookie(cookieName, { path: "/" });
  res.clearCookie(process.env.CSRF_COOKIE_NAME || "kss_csrf", { path: "/" });
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const raw = req.signedCookies?.[cookieName];
  if (!raw) return res.status(401).json({ error: "Authentication required" });

  const session = await prisma.adminSession.findFirst({
    where: {
      sessionHash: sha256(raw),
      revokedAt: null,
      expiresAt: { gt: new Date() }
    },
    include: { user: { include: { role: { include: { permissions: true } } } } }
  });

  if (!session) return res.status(401).json({ error: "Authentication required" });
  res.locals.user = session.user;
  next();
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const header = req.header("x-csrf-token");
  const csrfCookie = req.cookies?.[process.env.CSRF_COOKIE_NAME || "kss_csrf"];
  if (!header || !csrfCookie || header !== csrfCookie) {
    return res.status(403).json({ error: "Request rejected" });
  }
  next();
}
