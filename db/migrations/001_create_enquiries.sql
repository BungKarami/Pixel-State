-- Pixel State enquiry database, migration 001.
-- Run with: npm run db:migrate
-- This creates the enquiries table used by the public form and the admin inbox.
-- The inbox starts empty. No seed data is inserted by this migration.

CREATE TYPE enquiry_type AS ENUM ('quote', 'free_review');
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');

CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  website TEXT,
  enquiry_type enquiry_type NOT NULL DEFAULT 'quote',
  service TEXT,
  package TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status enquiry_status NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL DEFAULT '',
  quoted_value_cents INTEGER,
  follow_up_due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries (enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_follow_up ON enquiries (follow_up_due_date);
