"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      setError("Wrong password. Try again.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }
  return (
    <main className="wrap" style={{ paddingTop: 64, paddingBottom: 64, maxWidth: 480 }}>
      <h1>Admin sign in</h1>
      <p className="muted">This inbox is private. Sign in with the admin password from your environment variables.</p>
      <form className="form" onSubmit={submit}>
        <label>
          Admin password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <div className="notice error" role="alert">{error}</div>}
        <button className="btn" type="submit">Sign in</button>
      </form>
      <p><a href="/">Back to the public site</a></p>
    </main>
  );
}
