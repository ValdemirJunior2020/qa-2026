// src/pages/Criteria.js
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";

function Criteria() {
  const { isCompleted, getScore } = useProgress();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | certified | not-certified
  const [tagFilter, setTagFilter] = useState("all"); // all | tagName

  const normalizedQuery = query.trim().toLowerCase();

  const allTags = useMemo(() => {
    const set = new Set();
    criteriaData.forEach((c) => {
      (c.tags || []).forEach((t) => set.add(t));
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    return criteriaData.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const desc = (c.shortDescription || "").toLowerCase();
      const id = (c.id || "").toLowerCase();

      const matchesText =
        !normalizedQuery ||
        title.includes(normalizedQuery) ||
        desc.includes(normalizedQuery) ||
        id.includes(normalizedQuery);

      const certified = isCompleted(c.id);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "certified" && certified) ||
        (statusFilter === "not-certified" && !certified);

      const tags = c.tags || [];
      const matchesTag = tagFilter === "all" || tags.includes(tagFilter);

      return matchesText && matchesStatus && matchesTag;
    });
  }, [normalizedQuery, statusFilter, tagFilter, isCompleted]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>QA Criteria</h2>
          <p className="muted">
            Search + filter by certification status and tag.
          </p>
        </div>
      </div>

      <div className="criteria-controls">
        <div className="criteria-search">
          <label className="muted" htmlFor="criteriaSearch">
            Search
          </label>
          <input
            id="criteriaSearch"
            className="input"
            type="text"
            placeholder="Type to search (example: refund, recap, empathy, hold...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="criteria-filter">
          <label className="muted" htmlFor="criteriaStatus">
            Status
          </label>
          <select
            id="criteriaStatus"
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="certified">Certified</option>
            <option value="not-certified">Not Certified</option>
          </select>
        </div>

        <div className="criteria-filter">
          <label className="muted" htmlFor="criteriaTag">
            Tag
          </label>
          <select
            id="criteriaTag"
            className="input"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Tags" : t}
              </option>
            ))}
          </select>
        </div>

        <div className="criteria-count muted">
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{criteriaData.length}</strong>
        </div>
      </div>

      <div className="criteria-grid">
        {filtered.map((c) => {
          const done = isCompleted(c.id);
          const score = getScore(c.id);

          return (
            <Link key={c.id} to={`/criteria/${c.id}`} className="criteria-card">
              <div className="criteria-card-top">
                <h3 className="criteria-title">{c.title}</h3>

                <div className="badge-stack">
                  {score && score.passed === true && (
                    <span className="badge badge-pass">PASS {score.percent}%</span>
                  )}
                  {score && score.passed === false && (
                    <span className="badge badge-fail">FAIL {score.percent}%</span>
                  )}

                  {done ? (
                    <span className="badge badge-complete">✅ Certified</span>
                  ) : (
                    <span className="badge badge-pending">⏳ Not Certified</span>
                  )}
                </div>
              </div>

              <p className="criteria-points">{c.points} points</p>
              <p className="criteria-desc">{c.shortDescription}</p>

              {Array.isArray(c.tags) && c.tags.length > 0 && (
                <div className="tag-row">
                  {c.tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag-pill">
                      {t}
                    </span>
                  ))}
                  {c.tags.length > 4 && <span className="tag-pill tag-more">+{c.tags.length - 4}</span>}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Criteria;
