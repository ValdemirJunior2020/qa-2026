// src/pages/Criteria.js
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { criteriaData } from "../data/criteriaData";

export default function Criteria() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return criteriaData;
    return criteriaData.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.short || "").toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>QA Criteria</h1>
      <p className="muted">Search and open a criterion to view training video + quiz.</p>

      <div className="criteria-controls" style={{ gridTemplateColumns: "1fr auto" }}>
        <div className="criteria-search">
          <label className="muted">Search</label>
          <input
            className="input"
            placeholder="Type to search (example: greeting)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="criteria-count muted" style={{ alignSelf: "end" }}>
          Showing {filtered.length} of {criteriaData.length}
        </div>
      </div>

      <div className="criteria-grid">
        {filtered.map((c) => (
          <Link key={c.id} to={`/criteria/${c.id}`} className="criteria-card">
            <div className="criteria-card-top">
              <div>
                <h3 className="criteria-title">{c.title}</h3>
                <div className="criteria-points">{c.short}</div>
              </div>
              <span className="badge badge-pending">Not Certified</span>
            </div>

            <p className="criteria-desc">{c.short}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
