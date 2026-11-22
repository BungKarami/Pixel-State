"use client";

import { useState } from "react";

type Item = { title: string; sector: string; brief: string };

const ITEMS: Item[] = [
  { title: "Bendigo cafe, menu and bookings", sector: "Hospitality", brief: "A simple menu, opening hours and booking link, with photos that load fast on a phone." },
  { title: "Local tradie, quotes in one tap", sector: "Tradies", brief: "Services, service area and a quote form that works from a job site." },
  { title: "GP clinic, clear patient info", sector: "Medical GP", brief: "Services, doctors, opening hours and new patient steps, in plain language." },
  { title: "Professional services, trust first", sector: "Professional services", brief: "What you do, who you help, and how to start, without jargon." },
  { title: "Company website, done properly", sector: "Company", brief: "A clean company site with services, team and contact, built to be found locally." },
  { title: "Portfolio site for a local maker", sector: "Portfolio", brief: "Work first, words second, with a simple way to ask about a commission." }
];

const FILTERS = ["All", "Hospitality", "Tradies", "Medical GP", "Professional services", "Company", "Portfolio"];

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? ITEMS : ITEMS.filter((i) => i.sector === filter);
  return (
    <div>
      <div className="filters" role="group" aria-label="Filter portfolio">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} aria-pressed={filter === f}>
            {f}
          </button>
        ))}
      </div>
      <p className="muted" aria-live="polite">
        Showing {shown.length} of {ITEMS.length} concept builds.
      </p>
      <div className="grid3">
        {shown.map((item) => (
          <article className="card" key={item.title}>
            <span className="tag">Concept build</span>
            <h3 style={{ marginTop: 10 }}>{item.title}</h3>
            <p className="muted">{item.sector}</p>
            <p>{item.brief}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
