"use client";

import { useState } from "react";

const SERVICES = [
  "Company website",
  "Hospitality",
  "Professional services",
  "Tradies",
  "Medical GP profile",
  "Portfolio website"
];

const PACKAGES = ["Starter", "Growth", "Care", "Not sure yet"];

export default function QuoteForm({ contactEmail }: { contactEmail: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [enquiryNumber, setEnquiryNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    enquiryType: "quote",
    service: SERVICES[0],
    package: "Starter",
    budget: "",
    messageText: ""
  });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        website: form.website,
        enquiryType: form.enquiryType,
        service: form.service,
        package: form.package,
        budget: form.budget,
        message: form.messageText
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Something went wrong. Please try again.");
      return;
    }
    setStatus("ok");
    setEnquiryNumber(data.id || "");
    setMessage(
      "Thanks, your enquiry has been saved. We will reply within one business day."
    );
  }

  return (
    <form className="form" onSubmit={submit} id="quote-form">
      <div className="radio-row" role="radiogroup" aria-label="What do you need?">
        <label>
          <input
            type="radio"
            name="enquiryType"
            value="quote"
            checked={form.enquiryType === "quote"}
            onChange={() => update("enquiryType", "quote")}
          />
          Fixed quote
        </label>
        <label>
          <input
            type="radio"
            name="enquiryType"
            value="free_review"
            checked={form.enquiryType === "free_review"}
            onChange={() => update("enquiryType", "free_review")}
          />
          Free website review
        </label>
      </div>
      <label>
        Your name
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" />
      </label>
      <label>
        Email
        <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
      </label>
      <label>
        Phone (optional)
        <input value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
      </label>
      <label>
        Business name
        <input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
      </label>
      <label>
        Current website {form.enquiryType === "free_review" ? "(required for a free review)" : "(optional)"}
        <input
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          placeholder="https://yourwebsite.com.au"
        />
      </label>
      <label>
        What kind of website?
        <select value={form.service} onChange={(e) => update("service", e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Package
        <select value={form.package} onChange={(e) => update("package", e.target.value)}>
          {PACKAGES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label>
        Budget (optional)
        <input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. $2,000 to $3,500" />
      </label>
      <label>
        Tell us about your website or business
        <textarea required value={form.messageText} onChange={(e) => update("messageText", e.target.value)} />
      </label>
      {status === "error" && <div className="notice error" role="alert">{message}</div>}
      {status === "ok" && (
        <div className="notice ok" role="status">
          {message} {enquiryNumber ? `Enquiry reference: ${enquiryNumber}.` : ""}
        </div>
      )}
      <button className="btn btn-cyan" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Saving your enquiry..." : "Send my enquiry"}
      </button>
      <p className="muted" style={{ fontSize: 14 }}>
        Your enquiry is saved to our inbox. We reply within one business day. Prefer email? Contact us at {contactEmail}.
      </p>
    </form>
  );
}
