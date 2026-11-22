"use client";

import { useMemo, useState } from "react";

const BASES: Record<string, [number, number]> = {
  Starter: [1490, 1990],
  Growth: [2990, 3490],
  Care: [49, 99]
};

export default function Estimator() {
  const [pkg, setPkg] = useState("Growth");
  const [pages, setPages] = useState(5);
  const [booking, setBooking] = useState(false);
  const [copy, setCopy] = useState(false);
  const [care, setCare] = useState(false);

  const total = useMemo(() => {
    const [low, high] = BASES[pkg];
    let l = low;
    let h = high;
    const extraPages = Math.max(0, pages - 5) * 120;
    l += extraPages;
    h += extraPages;
    if (booking) { l += 300; h += 500; }
    if (copy) { l += 250; h += 450; }
    return [l, h];
  }, [pkg, pages, booking, copy]);

  return (
    <div className="card">
      <h3>Estimate your build</h3>
      <p className="muted">This is a guide only. Your fixed quote is confirmed in writing before work starts.</p>
      <div className="form">
        <label>
          Package
          <select value={pkg} onChange={(e) => setPkg(e.target.value)}>
            {Object.keys(BASES).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Pages: {pages}
          <input type="range" min={1} max={20} value={pages} onChange={(e) => setPages(Number(e.target.value))} />
        </label>
        <label>
          <input type="checkbox" checked={booking} onChange={(e) => setBooking(e.target.checked)} /> Booking or enquiry system
        </label>
        <label>
          <input type="checkbox" checked={copy} onChange={(e) => setCopy(e.target.checked)} /> Copywriting help
        </label>
        <label>
          <input type="checkbox" checked={care} onChange={(e) => setCare(e.target.checked)} /> Add Care plan
        </label>
      </div>
      <p style={{ fontSize: 28, fontWeight: 900, marginTop: 16 }}>
        ${total[0].toLocaleString("en-AU")} to ${total[1].toLocaleString("en-AU")}
      </p>
      {care && <p className="muted">Plus Care from $49 to $99 per month.</p>}
      <a className="btn" href="#quote">
        Get my fixed quote
      </a>
    </div>
  );
}
