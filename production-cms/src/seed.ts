import { prisma } from "./db.js";
import { hashPassword } from "./security/password.js";

const roles = [
  { name: "Owner", permissions: [["manage", "all"]] },
  { name: "Administrator", permissions: [["create", "page"], ["update", "page"], ["delete", "page"], ["create", "section"], ["update", "section"], ["delete", "section"], ["create", "menu"], ["update", "menu"], ["read", "menu"], ["update", "content"], ["create", "media"], ["read", "media"], ["update", "media"], ["delete", "media"], ["create", "backup"], ["restore", "backup"], ["read", "content"], ["read", "page"], ["read", "notice"], ["create", "notice"], ["update", "notice"], ["delete", "notice"], ["read", "event"], ["create", "event"], ["update", "event"], ["delete", "event"], ["read", "faculty"], ["create", "faculty"], ["update", "faculty"], ["delete", "faculty"], ["read", "result"], ["create", "result"], ["update", "result"], ["delete", "result"], ["read", "gallery"], ["create", "gallery"], ["delete", "gallery"], ["read", "contact"], ["update", "contact"], ["read", "seo"], ["update", "seo"], ["read", "user"], ["create", "user"], ["update", "user"]] },
  { name: "Editor", permissions: [["update", "content"], ["create", "media"], ["read", "content"], ["read", "page"]] },
  { name: "Viewer", permissions: [["read", "content"], ["read", "page"]] }
];

for (const role of roles) {
  await prisma.role.upsert({
    where: { name: role.name },
    create: {
      name: role.name,
      permissions: {
        connectOrCreate: role.permissions.map(([action, subject]) => ({
          where: { action_subject: { action, subject } },
          create: { action, subject }
        }))
      }
    },
    update: {}
  });
}

const ownerRole = await prisma.role.findUniqueOrThrow({ where: { name: "Owner" } });
const adminEmail = process.env.ADMIN_EMAIL || "vishalregmi82@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminPassword || adminPassword.length < 12) {
  throw new Error("Set ADMIN_PASSWORD in Render before running npm run seed. Use at least 12 characters.");
}

await prisma.user.upsert({
  where: { email: adminEmail },
  create: {
    email: adminEmail,
    name: "Kankai Owner",
    passwordHash: await hashPassword(adminPassword),
    roleId: ownerRole.id
  },
  update: {
    passwordHash: await hashPassword(adminPassword),
    roleId: ownerRole.id,
    lockedUntil: null,
    isLocked: false
  }
});

console.log(`Seeded CMS roles, permissions and owner account for ${adminEmail}.`);
