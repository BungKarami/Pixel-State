import { NextRequest, NextResponse } from "next/server";
import { pool, toEnquiry, newId, type EnquiryRow } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { addDays, validateEnquiry } from "@/lib/validation";

// POST /api/enquiries, public. Saves a new enquiry and sets follow up to +2 days.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validateEnquiry(body);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const id = newId();
    const followUp = addDays(new Date(), 2);
    const result = await pool.query<EnquiryRow>(
      `INSERT INTO enquiries
        (id, name, email, phone, business_name, website, enquiry_type, service, package, budget, message, follow_up_due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        id,
        String(body.name).trim(),
        String(body.email).trim().toLowerCase(),
        body.phone ? String(body.phone).trim() : null,
        body.businessName ? String(body.businessName).trim() : null,
        body.website ? String(body.website).trim() : null,
        body.enquiryType === "free_review" ? "free_review" : "quote",
        body.service ? String(body.service) : null,
        body.package ? String(body.package) : null,
        body.budget ? String(body.budget) : null,
        String(body.message).trim(),
        followUp.toISOString()
      ]
    );
    return NextResponse.json({ ok: true, id: result.rows[0].id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save your enquiry. Please try again." }, { status: 500 });
  }
}

// GET /api/enquiries, admin only. Supports search, status, type, sort.
export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const status = url.searchParams.get("status") || "";
  const type = url.searchParams.get("type") || "";
  const sort = url.searchParams.get("sort") || "oldest_waiting";

  const conditions: string[] = [];
  const params: unknown[] = [];
  if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
  if (type) { params.push(type); conditions.push(`enquiry_type = $${params.length}`); }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length} OR business_name ILIKE $${params.length} OR message ILIKE $${params.length})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rowsResult = await pool.query<EnquiryRow>(
    `SELECT * FROM enquiries ${where} ORDER BY created_at ASC`,
    params
  );
  const rows = rowsResult.rows.map(toEnquiry);
  const now = new Date();
  const isOverdue = (r: (typeof rows)[number]) =>
    r.status === "new" && new Date(r.followUpDueDate) < now;
  const sorted = [...rows];
  if (sort === "newest") sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  else if (sort === "follow_up") sorted.sort((a, b) => +new Date(a.followUpDueDate) - +new Date(b.followUpDueDate));
  else if (sort === "oldest") sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  else {
    sorted.sort((a, b) => {
      const aNew = a.status === "new" ? 0 : 1;
      const bNew = b.status === "new" ? 0 : 1;
      if (aNew !== bNew) return aNew - bNew;
      const aOver = isOverdue(a) ? 0 : 1;
      const bOver = isOverdue(b) ? 0 : 1;
      if (aOver !== bOver) return aOver - bOver;
      return +new Date(a.createdAt) - +new Date(b.createdAt);
    });
  }

  const countsResult = await pool.query<{ status: string; count: string }>(
    `SELECT status, COUNT(*)::text AS count FROM enquiries GROUP BY status`
  );
  const byStatus: Record<string, number> = { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
  for (const c of countsResult.rows) byStatus[c.status] = Number(c.count);

  async function sumCents(condition: string): Promise<number> {
    const r = await pool.query<{ total: string | null }>(
      `SELECT COALESCE(SUM(quoted_value_cents), 0)::text AS total FROM enquiries WHERE ${condition}`
    );
    return Number(r.rows[0].total || 0);
  }
  const totalQuotedCents = await sumCents("quoted_value_cents IS NOT NULL");
  const pipelineCents = await sumCents("status IN ('contacted', 'quoted')");
  const wonCents = await sumCents("status = 'won'");
  const openPipelineCents = await sumCents("status IN ('new', 'contacted', 'quoted')");

  const overdueCount = rows.filter(isOverdue).length;
  const staleCount = rows.filter(
    (r) => r.status === "new" && Date.now() - +new Date(r.createdAt) > 2 * 24 * 60 * 60 * 1000
  ).length;

  return NextResponse.json({
    enquiries: sorted,
    counts: byStatus,
    money: { totalQuotedCents, pipelineCents, wonCents, openPipelineCents },
    attention: { overdueCount, staleCount, needsAttention: overdueCount + staleCount }
  });
}
