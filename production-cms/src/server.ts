import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { securityMiddleware } from "./security/security-middleware.js";
import { authRouter } from "./routes/auth.js";
import { contentRouter } from "./routes/content.js";
import { mediaRouter } from "./routes/media.js";
import { backupRouter } from "./routes/backups.js";
import { siteRouter } from "./routes/site-management.js";
import { noticeRouter } from "./routes/notices.js";
import { galleryRouter } from "./routes/gallery.js";
import { contactRouter } from "./routes/contact.js";
import { seoRouter } from "./routes/seo.js";
import { userRouter } from "./routes/users.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(securityMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/admin/content", contentRouter);
app.use("/api/admin/media", mediaRouter);
app.use("/api/admin/backups", backupRouter);
app.use("/api/admin/site", siteRouter);
app.use("/api/admin/notices", noticeRouter);
app.use("/api/admin/gallery", galleryRouter);
app.use("/api/admin/contact", contactRouter);
app.use("/api/admin/seo", seoRouter);
app.use("/api/admin/users", userRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Kankai CMS API listening on ${port}`);
});
