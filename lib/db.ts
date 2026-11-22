import { Pool } from "pg";

// Postgres access via node-postgres (pg). No binary engine download is
// needed, which keeps install and deploy simple on Vercel and locally.
const globalForPool = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    ssl:
      process.env.DATABASE_URL && process.env.DATABASE_URL.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool;
}

export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  website: string | null;
  enquiry_type: string;
  service: string | null;
  package: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string;
  quoted_value_cents: number | null;
  follow_up_due_date: Date;
  created_at: Date;
  updated_at: Date;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  website: string | null;
  enquiryType: string;
  service: string | null;
  package: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string;
  quotedValueCents: number | null;
  followUpDueDate: string;
  createdAt: string;
};

export function toEnquiry(r: EnquiryRow): Enquiry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    businessName: r.business_name,
    website: r.website,
    enquiryType: r.enquiry_type,
    service: r.service,
    package: r.package,
    budget: r.budget,
    message: r.message,
    status: r.status,
    notes: r.notes,
    quotedValueCents: r.quoted_value_cents,
    followUpDueDate: new Date(r.follow_up_due_date).toISOString(),
    createdAt: new Date(r.created_at).toISOString()
  };
}

export function newId(): string {
  return `enq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
