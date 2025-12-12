// src/components/AdminGate.js
import React, { useMemo, useState } from "react";
import { ADMIN_EMAILS } from "../config/admins";

function AdminGate({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem("hp2026_admin_email") || "");
  const isAdmin = useMemo(() => ADMIN_EMAILS.includes((email || "").trim().toLowerCase()), [email]);

  const handleSave = (e) => {
    e.preventDefault();
    const clean = (email || "").trim().toLowerCase();
    localStorage.setItem("hp2026_admin_email", clean);
    setEmail(clean);
  };

  if (!isAdmin) {
    return (
      <section className="page">
        <h2>Admin Access Required</h2>
        <p className="muted">
          This area is restricted. Enter an approved admin email to continue.
        </p>

        <form onSubmit={handleSave} className="admin-gate">
          <input
            className="admin-input"
            type="email"
            placeholder="admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="primary-btn" type="submit">
            Enter
          </button>
        </form>

        <p className="muted" style={{ marginTop: "0.75rem" }}>
          (Temporary gate — we’ll replace with real login later.)
        </p>
      </section>
    );
  }

  return children;
}

export default AdminGate;
