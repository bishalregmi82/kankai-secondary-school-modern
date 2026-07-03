import argon2 from "argon2";
import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });
  } catch {
    return bcrypt.hash(password, 12);
  }
}

export async function verifyPassword(hash: string, password: string) {
  if (hash.startsWith("$argon2")) return argon2.verify(hash, password);
  return bcrypt.compare(password, hash);
}
