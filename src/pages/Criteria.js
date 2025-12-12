import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchExpectations } from "../api/expectationsApi";

function Criteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [tag, setTag] = useState("all");

  useEffect(() => {
    fetchExpectations()
      .then(setCriteria)
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    criteria.forEach((c) => {
      const tags = Array.isArray(c.tags) ? c.tags : [];
      tags.forEach((t) => s.add(t));
    });
    return ["all", ...Array.from(s).sort()];
  }, [criteria]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return criteria.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const tags = Array.isArray(c.tags) ? c.tags : [];

      const matchesSearch =
        !q ||
        title.includes(q) ||
        tags.some((t) => String(t).toLowerCase().includes(q));

      const matchesTag = tag === "all" ? true : tags.includes(tag);

      // Placeholder (until certification status is stored)
      const matchesStatus = status === "all" ? true : true;

      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [criteria, search, status, tag]);

  if (loading) return <p className="page">Loading criteria…</p>;

  return (
    <section className="page">
      <h2>QA Criteria</h2>
      <p className="muted">Search + filter by certification status and tag.</p>

      <div className="filters-row">
        <div className="filter">
          <label>Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search (example: refund, recap, empathy...)"
          />
        </div>

        <div className="filter">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
          </select>
        </div>

        <div className="filter">
          <label>Tag</label>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Tags" : t}
              </option>
            ))}
          </select>
        </div>

        <div className="filter meta">
          Showing {filtered.length} of {criteria.length}
        </div>
      </div>

      <div className="criteria-grid">
        {filtered.map((c) => {
          const firstBullet = c.sections?.[0]?.bullets?.[0] || "View expectation";

          return (
            <Link key={c.id} to={`/criteria/${c.id}`} className="criteria-card">
              <h3>{c.title}</h3>
              <p className="muted">{firstBullet}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Criteria;
