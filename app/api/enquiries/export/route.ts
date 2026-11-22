import { NextRequest, NextResponse } from "next/server";
import { pool, type EnquiryRow } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { fromCents } from "@/lib/validation";

function csvCell(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

// GET /api/enquiries/export, admin only. Respects status and type filters.
export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const type = url.searchParams.get("type") || "";
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
  if (type) { params.push(type); conditions.push(`enquiry_type = $${params.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await pool.query<EnquiryRow>(
    `SELECT * FROM enquiries ${where} ORDER BY created_at ASC`,
    params
  );
  const header = ["created_at", "name", "email", "phone", "business_name", "website", "enquiry_type", "service", "package", "budget", "message", "status", "quoted_value_aud", "follow_up_due_date", "notes"];
  const lines = [header.join(",")];
  for (const r of rows.rows) {
    lines.push(
      [
        new Date(r.created_at).toISOString(),
        r.name,
        r.email,
        r.phone,
        r.business_name,
        r.website,
        r.enquiry_type,
        r.service,
        r.package,
        r.budget,
        r.message,
        r.status,
        fromCents(r.quoted_value_cents),
        new Date(r.follow_up_due_date).toISOString().slice(0, 10),
        r.notes
      ]
        .map(csvCell)
        .join(",")
    );
  }
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pixel-state-enquiries-${date}.csv"`
    }
  });
}
