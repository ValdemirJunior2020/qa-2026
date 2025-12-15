// src/pages/AdminProgress.js
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminProgress() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => (r.email || "").toLowerCase().includes(q));
  }, [rows, search]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setStatus("");

      const { data, error } = await supabase
        .from("user_progress")
        .select("user_id,email,completed,scores,updated_at")
        .order("updated_at", { ascending: false });

      if (!alive) return;

      if (error) {
        setStatus(`Error: ${error.message}`);
        setRows([]);
      } else {
        setRows(data || []);
        setStatus("Ready");
      }

      setLoading(false);
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const exportCSV = () => {
    const header = ["Email", "Completed Criteria", "Readiness %", "Last Updated"];

    const lines = filtered.map((r) => {
      const completedCount = Object.keys(r.completed || {}).length;

      // Readiness from points (quick): % = completedCount / total criteria
      // (Your official readiness is already in the UI; this is just export-friendly)
      const readiness = ""; // keep blank for now (optional)

      const updated = r.updated_at ? new Date(r.updated_at).toLocaleString() : "";
      return [
        (r.email || "").replaceAll(",", " "),
        String(completedCount),
        readiness,
        updated.replaceAll(",", " "),
      ].join(",");
    });

    const csv = [header.join(","), ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "user_progress.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page">
      <h2>Admin — User Progress</h2>
      <p className="muted">Search by email and export results.</p>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <input
          className="input"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-status">{loading ? "Loading…" : status}</div>
      </div>

      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table className="progress-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                Email
              </th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                Completed
              </th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.user_id}>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                  {r.email || "—"}
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                  {Object.keys(r.completed || {}).length}
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                  {r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="primary-btn" style={{ marginTop: 12 }} onClick={exportCSV} type="button">
        Export CSV
      </button>
    </div>
  );
}
