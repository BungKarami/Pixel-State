export const ENQUIRY_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_TYPES = ["quote", "free_review"] as const;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validateEnquiry(input: {
  name?: unknown;
  email?: unknown;
  enquiryType?: unknown;
  website?: unknown;
  message?: unknown;
}): string | null {
  if (!input.name || typeof input.name !== "string" || input.name.trim().length < 2) {
    return "Please enter your name.";
  }
  if (!input.email || typeof input.email !== "string" || !isValidEmail(input.email)) {
    return "Please enter a valid email address.";
  }
  if (
    input.enquiryType === "free_review" &&
    (!input.website || typeof input.website !== "string" || input.website.trim().length < 4)
  ) {
    return "For a free website review, please enter your current website address.";
  }
  if (!input.message || typeof input.message !== "string" || input.message.trim().length < 5) {
    return "Please tell us a little about your website or your business.";
  }
  return null;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toCents(aud: unknown): number | null {
  if (aud === null || aud === undefined || aud === "") return null;
  const n = Number(aud);
  if (!Number.isFinite(n) || n < 0 || n > 1000000) return null;
  return Math.round(n * 100);
}

export function fromCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}
