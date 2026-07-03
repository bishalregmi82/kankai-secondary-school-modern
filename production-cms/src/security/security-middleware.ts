import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";

export const securityMiddleware: RequestHandler[] = [
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://res.cloudinary.com"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "frame-ancestors": ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" }
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false
  })
];
