import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "fp_admin";

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-secret-change-me";
}

export function signSession(): string {
  return createHmac("sha256", secret()).update("pixel-state-admin").digest("hex");
}

export function isAdminAuthenticated(): boolean {
  const cookie = cookies().get(ADMIN_COOKIE);
  if (!cookie) return false;
  const expected = signSession();
  const a = Buffer.from(cookie.value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "hello@pixelstate.com.au";
