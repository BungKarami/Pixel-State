import { NextRequest, NextResponse } from "next/server";
import { pool, toEnquiry, type EnquiryRow } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { ENQUIRY_STATUSES, toCents } from "@/lib/validation";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.status !== undefined) {
    if (!ENQUIRY_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Status must be new, contacted, quoted, won or lost." }, { status: 400 });
    }
    values.push(body.status);
    sets.push(`status = $${values.length}`);
  }
  if (body.notes !== undefined) {
    values.push(String(body.notes));
    sets.push(`notes = $${values.length}`);
  }
  if (body.quotedValueAud !== undefined) {
    const cents = toCents(body.quotedValueAud);
    if (body.quotedValueAud !== "" && body.quotedValueAud !== null && cents === null) {
      return NextResponse.json({ error: "Quoted value must be a number in AUD." }, { status: 400 });
    }
    values.push(cents);
    sets.push(`quoted_value_cents = $${values.length}`);
  }
  if (body.followUpDueDate !== undefined) {
    const d = new Date(body.followUpDueDate);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Follow up date is not valid." }, { status: 400 });
    }
    values.push(d.toISOString());
    sets.push(`follow_up_due_date = $${values.length}`);
  }
  if (sets.length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  sets.push("updated_at = now()");
  values.push(params.id);
  const result = await pool.query<EnquiryRow>(
    `UPDATE enquiries SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, enquiry: toEnquiry(result.rows[0]) });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const result = await pool.query(`DELETE FROM enquiries WHERE id = $1`, [params.id]);
  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
