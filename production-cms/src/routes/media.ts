import express from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireCsrf } from "../security/session.js";
import { requirePermission } from "../security/rbac.js";

export const mediaRouter = express.Router();
mediaRouter.use(requireAdmin);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    cb(null, allowed.includes(file.mimetype));
  }
});

const mediaUpdateSchema = z.object({
  alt: z.string().max(500).optional(),
  tags: z.array(z.string().max(80)).optional(),
  useForAllLanguages: z.boolean().optional()
});

mediaRouter.get("/", requirePermission("read", "media"), async (req, res) => {
  const search = String(req.query.search || "").trim();
  const media = await prisma.media.findMany({
    where: search ? {
      OR: [
        { alt: { contains: search, mode: "insensitive" } },
        { publicId: { contains: search, mode: "insensitive" } },
        { tags: { has: search } }
      ]
    } : undefined,
    include: { variants: { include: { language: true } }, uploads: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json({ media });
});

function uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
  const folder = process.env.CLOUDINARY_FOLDER || "kankai-secondary-school";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

mediaRouter.post("/upload", requireCsrf, requirePermission("create", "media"), upload.array("files", 10), async (req, res) => {
  const files = (req.files || []) as Express.Multer.File[];
  const saved = await Promise.all(files.map(async (file) => {
    const uploaded = await uploadToCloudinary(file);
    const checksum = crypto.createHash("sha256").update(file.buffer).digest("hex");
    const media = await prisma.media.create({
      data: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        type: file.mimetype,
        alt: path.parse(file.originalname).name,
        folder: process.env.CLOUDINARY_FOLDER || "kankai-secondary-school",
        uploads: {
          create: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            checksum,
            storageKey: uploaded.public_id,
            uploadedBy: res.locals.user.id,
            virusScanStatus: "CLOUDINARY_STORED"
          }
        }
      }
    });
    return media;
  }));
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "file_upload", entity: "Media" } });
  res.json({ files: saved });
});

mediaRouter.put("/:id", requireCsrf, requirePermission("update", "media"), async (req, res) => {
  const media = await prisma.media.update({
    where: { id: req.params.id },
    data: mediaUpdateSchema.parse(req.body)
  });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "media_update", entity: "Media", entityId: media.id } });
  res.json({ media });
});

mediaRouter.delete("/:id", requireCsrf, requirePermission("delete", "media"), async (req, res) => {
  const media = await prisma.media.findUniqueOrThrow({ where: { id: req.params.id } });
  await cloudinary.uploader.destroy(media.publicId, { resource_type: "image" }).catch(() => undefined);
  await prisma.media.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({ data: { userId: res.locals.user.id, action: "media_delete", entity: "Media", entityId: req.params.id } });
  res.json({ ok: true });
});
