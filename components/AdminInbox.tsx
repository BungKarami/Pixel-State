"use client";

import { useCallback, useEffect, useState } from "react";
import { buildDraft, type DraftKind } from "@/lib/replyDrafts";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  businessName?: string | null;
  website?: string | null;
  enquiryType: string;
  service?: string | null;
  package?: string | null;
  budget?: string | null;
  message: string;
  status: string;
  notes: string;
  quotedValueCents?: number | null;
  followUpDueDate: string;
  createdAt: string;
};

type ListData = {
  enquiries: Enquiry[];
  counts: Record<string, number>;
  money: { totalQuotedCents: number; pipelineCents: number; wonCents: number; openPipelineCents: number };
  attention: { overdueCount: number; staleCount: number; needsAttention: number };
};

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];
const PRESETS = [1490, 1990, 2990, 3490];

function aud(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-AU")}`;
}
function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}
function isOverdue(e: Enquiry): boolean {
  return e.status === "new" && new Date(e.followUpDueDate) < new Date();
}

export default function AdminInbox() {
  const [data, setData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("oldest_waiting");
  const [openId, setOpenId] = useState<string | null>(null);
  const [draftKind, setDraftKind] = useState<DraftKind>("first_reply");
  const [draftText, setDraftText] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ q, status, type, sort });
    const res = await fetch(`/api/enquiries?${params.toString()}`);
    if (!res.ok) {
      setError("Could not load enquiries. Please sign in again.");
      setLoading(false);
      return;
    }
    setData(await res.json());
    setLoading(false);
  }, [q, status, type, sort]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Could not save that change.");
      return;
    }
    load();
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete the enquiry from ${name}? This cannot be undone.`)) return;
    if (!window.confirm("Are you sure? This will permanently delete this enquiry.")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setOpenId(null);
    load();
  }

  function openDraft(e: Enquiry, kind: DraftKind) {
    const d = buildDraft(kind, e);
    setDraftKind(kind);
    setDraftSubject(d.subject);
    setDraftText(d.body);
  }

  function exportCsv() {
    const params = new URLSearchParams({ status, type });
    window.location.href = `/api/enquiries/export?${params.toString()}`;
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  function followUpShortcut(e: Enquiry, label: string) {
    const d = new Date();
    if (label === "Today") d.setDate(d.getDate());
    if (label === "Tomorrow") d.setDate(d.getDate() + 1);
    if (label === "+2 days") d.setDate(d.getDate() + 2);
    if (label === "+1 week") d.setDate(d.getDate() + 7);
    patch(e.id, { followUpDueDate: d.toISOString().slice(0, 10) });
  }

  if (loading && !data) return <p>Loading enquiries...</p>;
  if (error) return <div className="notice error">{error}</div>;
  if (!data) return <p>No data yet.</p>;

  const attention = data.attention;
  return (
    <div>
      <div className="money-strip">
        <div className="money"><span className="muted">Total quoted</span><b>{aud(data.money.totalQuotedCents)}</b></div>
        <div className="money"><span className="muted">Pipeline (Contacted + Quoted)</span><b>{aud(data.money.pipelineCents)}</b></div>
        <div className="money"><span className="muted">Won</span><b>{aud(data.money.wonCents)}</b></div>
        <div className="money"><span className="muted">Open pipeline</span><b>{aud(data.money.openPipelineCents)}</b></div>
      </div>

      {attention.needsAttention > 0 && (
        <div className="banner" role="alert">
          Needs attention: {attention.overdueCount} overdue and {attention.staleCount} stale New leads. The oldest waiting lead is at the top.
        </div>
      )}

      <div className="panel">
        <strong>Pipeline:</strong>{" "}
        {STATUSES.map((s) => (
          <span key={s} style={{ marginRight: 12 }}>{s}: {data.counts[s] || 0}</span>
        ))}
      </div>

      <div className="toolbar">
        <label>Search<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, business, email or message" /></label>
        <label>Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="quote">Fixed quote</option>
            <option value="free_review">Free review</option>
          </select>
        </label>
        <label>Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="oldest_waiting">Oldest waiting</option>
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
            <option value="follow_up">Follow-up due soonest</option>
          </select>
        </label>
        <button className="btn btn-small" type="button" onClick={exportCsv}>Export CSV</button>
        <button className="btn btn-light btn-small" type="button" onClick={signOut}>Sign out</button>
      </div>

      {data.enquiries.length === 0 && (
        <div className="notice">No enquiries yet. The inbox starts empty. New enquiries from the public form will appear here.</div>
      )}

      {data.enquiries.map((e) => {
        const open = openId === e.id;
        const overdue = isOverdue(e);
        return (
          <article key={e.id} className={`enquiry-row ${overdue ? "overdue" : ""}`}>
            <button type="button" onClick={() => setOpenId(open ? null : e.id)} style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}>
              <strong>{e.name}{e.businessName ? `, ${e.businessName}` : ""}</strong>
              {" "}<span className="tag">{e.status}</span>{" "}
              {overdue && <span className="tag" style={{ background: "#fdecea", color: "#a83226" }}>Overdue</span>}
              <br />
              <span className="muted">{e.enquiryType === "free_review" ? "Free review" : "Fixed quote"}{e.service ? `, ${e.service}` : ""}{e.package ? `, ${e.package}` : ""} | Follow up by {dateOnly(e.followUpDueDate)} | {dateOnly(e.createdAt)}</span>
            </button>
            {open && (
              <div style={{ marginTop: 12 }}>
                <p><strong>Email:</strong> <a href={`mailto:${e.email}`}>{e.email}</a>{e.phone ? <> | <strong>Phone:</strong> {e.phone}</> : ""}</p>
                {e.website && <p><strong>Website:</strong> <a href={e.website} target="_blank" rel="noreferrer">{e.website}</a></p>}
                {e.budget && <p><strong>Budget:</strong> {e.budget}</p>}
                <p><strong>Message:</strong><br />{e.message}</p>

                <div className="status-btns" role="group" aria-label="Change status">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" className={e.status === s ? "on" : ""} onClick={() => patch(e.id, { status: s })}>{s}</button>
                  ))}
                </div>

                <div className="form">
                  <label>Quoted value (AUD)
                    <input
                      type="number" min="0" step="1"
                      defaultValue={e.quotedValueCents ? (e.quotedValueCents / 100).toString() : ""}
                      onBlur={(ev) => patch(e.id, { quotedValueAud: ev.target.value })}
                      placeholder="e.g. 2990"
                    />
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {PRESETS.map((p) => (
                      <button key={p} type="button" className="chip" onClick={() => patch(e.id, { quotedValueAud: p })}>${p.toLocaleString("en-AU")}</button>
                    ))}
                  </div>
                  <label>Follow-up due date
                    <input type="date" defaultValue={dateOnly(e.followUpDueDate)} onChange={(ev) => patch(e.id, { followUpDueDate: ev.target.value })} />
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Today", "Tomorrow", "+2 days", "+1 week"].map((label) => (
                      <button key={label} type="button" className="chip" onClick={() => followUpShortcut(e, label)}>{label}</button>
                    ))}
                  </div>
                  <label>Private notes
                    <textarea defaultValue={e.notes} onBlur={(ev) => patch(e.id, { notes: ev.target.value })} placeholder="Notes only you can see." />
                  </label>
                </div>

                <h3 style={{ marginTop: 18 }}>Reply drafts</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" className="chip" onClick={() => openDraft(e, "first_reply")}>First reply</button>
                  <button type="button" className="chip" onClick={() => openDraft(e, "quote_ready")}>Quote ready</button>
                  <button type="button" className="chip" onClick={() => openDraft(e, "follow_up")}>Follow-up nudge</button>
                </div>
                {draftText && (
                  <div>
                    <p><strong>Subject:</strong> {draftSubject}</p>
                    <textarea className="draft-box" style={{ width: "100%", minHeight: 180 }} value={draftText} onChange={(ev) => setDraftText(ev.target.value)} />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" className="btn btn-small" onClick={async () => { await navigator.clipboard.writeText(`Subject: ${draftSubject}\n\n${draftText}`); setCopied("Copied."); }}>Copy draft</button>
                      <a className="btn btn-light btn-small" href={`mailto:${e.email}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftText)}`}>Open in email app</a>
                      <button type="button" className="btn btn-light btn-small" onClick={() => patch(e.id, { status: "contacted" })}>Mark as Contacted</button>
                    </div>
                    {copied && <p className="muted">{copied}</p>}
                  </div>
                )}

                <div style={{ marginTop: 16 }}>
                  <button type="button" className="btn btn-light btn-small" onClick={() => remove(e.id, e.name)}>Delete enquiry</button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
