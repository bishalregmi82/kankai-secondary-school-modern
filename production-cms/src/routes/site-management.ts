import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const siteRouter = express.Router();
siteRouter.use(requireAdmin);

const pageSchema = z.object({
  path: z.string().min(1).max(180).regex(/^\/[a-z0-9\-\/]*$/i),
  template: z.string().min(1).max(80),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"])
});

const sectionSchema = z.object({
  pageId: z.string().min(1),
  sectionKey: z.string().min(1).max(120),
  sortOrder: z.number().int().min(0),
  hidden: z.boolean().default(false),
  settings: z.record(z.unknown()).optional()
});

const menuSchema = z.object({
  key: z.string().min(1).max(80),
  location: z.string().min(1).max(80)
});

const menuItemSchema = z.object({
  menuId: z.string().min(1),
  labelKey: z.string().min(1).max(160),
  href: z.string().min(1).max(500),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0),
  openInNewTab: z.boolean().default(false),
  enabled: z.boolean().default(true)
});

siteRouter.get("/pages", requirePermission("read", "page"), async (_req, res) => {
  const pages = await prisma.page.findMany({ include: { sections: { orderBy: { sortOrder: "asc" } } } });
  res.json({ pages });
});

siteRouter.post("/pages", requireCsrf, requirePermission("create", "page"), async (req, res) => {
  const input = pageSchema.parse(req.body);
  const page = await prisma.page.create({ data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "page_create", entity: "Page", entityId: page.id } });
  res.json({ page });
});

siteRouter.put("/pages/:id", requireCsrf, requirePermission("update", "page"), async (req, res) => {
  const input = pageSchema.partial().parse(req.body);
  const page = await prisma.page.update({ where: { id: req.params.id }, data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "page_update", entity: "Page", entityId: page.id } });
  res.json({ page });
});

siteRouter.post("/sections", requireCsrf, requirePermission("create", "section"), async (req, res) => {
  const input = sectionSchema.parse(req.body);
  const section = await prisma.pageSection.create({ data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "section_create", entity: "PageSection", entityId: section.id } });
  res.json({ section });
});

siteRouter.put("/sections/:id", requireCsrf, requirePermission("update", "section"), async (req, res) => {
  const input = sectionSchema.partial().parse(req.body);
  const section = await prisma.pageSection.update({ where: { id: req.params.id }, data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "section_update", entity: "PageSection", entityId: section.id } });
  res.json({ section });
});

siteRouter.post("/menus", requireCsrf, requirePermission("create", "menu"), async (req, res) => {
  const input = menuSchema.parse(req.body);
  const menu = await prisma.menu.create({ data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "menu_create", entity: "Menu", entityId: menu.id } });
  res.json({ menu });
});

siteRouter.post("/menus/items", requireCsrf, requirePermission("create", "menu"), async (req, res) => {
  const input = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.create({ data: input });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "menu_item_create", entity: "MenuItem", entityId: item.id } });
  res.json({ item });
});
