import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { securityMiddleware } from "./security/security-middleware.js";
import { authRouter } from "./routes/auth.js";
import { contentRouter, publicContentRouter } from "./routes/content.js";
import { mediaRouter } from "./routes/media.js";
import { backupRouter } from "./routes/backups.js";
import { siteRouter } from "./routes/site-management.js";
import { noticeRouter, publicNoticeRouter } from "./routes/notices.js";
import { galleryRouter } from "./routes/gallery.js";
import { contactRouter } from "./routes/contact.js";
import { seoRouter, publicSeoRouter } from "./routes/seo.js";
import { userRouter } from "./routes/users.js";
import { eventRouter, publicEventRouter } from "./routes/events.js";
import { facultyRouter, publicFacultyRouter } from "./routes/faculty.js";
import { resultRouter, publicResultRouter } from "./routes/results.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.PUBLIC_SITE_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.header("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-csrf-token");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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
app.use("/api/public/notices", publicNoticeRouter);
app.use("/api/admin/events", eventRouter);
app.use("/api/admin/faculty", facultyRouter);
app.use("/api/admin/results", resultRouter);
app.use("/api/public/content", publicContentRouter);
app.use("/api/public/events", publicEventRouter);
app.use("/api/public/faculty", publicFacultyRouter);
app.use("/api/public/results", publicResultRouter);
app.use("/api/public/seo", publicSeoRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Kankai CMS API listening on ${port}`);
});
