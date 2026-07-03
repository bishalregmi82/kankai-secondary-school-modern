import express from "express";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const backupRouter = express.Router();
backupRouter.use(requireAdmin);

backupRouter.post("/", requireCsrf, requirePermission("create", "backup"), async (_req, res) => {
  const backup = await prisma.backupJob.create({
    data: {
      type: "MANUAL",
      status: "QUEUED",
      createdBy: res.locals.user.id
    }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "backup_queued", entity: "BackupJob", entityId: backup.id } });
  res.json({ backup });
});

backupRouter.post("/:backupId/restore", requireCsrf, requirePermission("restore", "backup"), async (req, res) => {
  const restore = await prisma.restoreJob.create({
    data: {
      backupId: req.params.backupId,
      status: "QUEUED",
      requestedBy: res.locals.user.id
    }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "restore_queued", entity: "RestoreJob", entityId: restore.id } });
  res.json({ restore });
});
