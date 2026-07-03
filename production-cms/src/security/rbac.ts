import type { Request, Response, NextFunction } from "express";

export function requirePermission(action: string, subject: string) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    const allowed = user?.role?.permissions?.some((permission: { action: string; subject: string }) => {
      return (permission.action === action || permission.action === "manage") && (permission.subject === subject || permission.subject === "all");
    });
    if (!allowed) return res.status(403).json({ error: "Not allowed" });
    next();
  };
}
