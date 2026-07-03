import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const contactRouter = express.Router();
contactRouter.use(requireAdmin);

const settingSchema = z.object({
  key: z.enum(["contact.address", "contact.phone", "contact.email", "contact.map", "contact.officeHours", "contact.socialLinks"]),
  value: z.unknown()
});

contactRouter.get("/", requirePermission("read", "contact"), async (_req, res) => {
  const settings = await prisma.setting.findMany({ where: { key: { startsWith: "contact." } } });
  res.json({ settings });
});

contactRouter.put("/", requireCsrf, requirePermission("update", "contact"), async (req, res) => {
  const input = settingSchema.parse(req.body);
  const setting = await prisma.setting.upsert({
    where: { key: input.key },
    create: { key: input.key, value: input.value },
    update: { value: input.value }
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "contact_update", entity: "Setting", entityId: setting.id } });
  res.json({ setting });
});
