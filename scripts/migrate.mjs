// Runs db/migrations/001_create_enquiries.sql against DATABASE_URL.
// Usage: npm run db:migrate
// Loads .env.local when present, so local development needs no extra flags.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
for (const name of [".env.local", ".env"]) {
  const p = path.join(root, name);
  if (existsSync(p)) {
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]+)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
    break;
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env.local and set it.");
  process.exit(1);
}

const sql = readFileSync(path.join(root, "db/migrations/001_create_enquiries.sql"), "utf8");
const client = new pg.Client({ connectionString: url });
await client.connect();
await client.query(sql);
await client.end();
console.log("Migration 001 applied. Enquiries table is ready.");
