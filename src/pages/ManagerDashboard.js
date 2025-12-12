// src/pages/ManagerDashboard.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";

function ManagerDashboard() {
  const { isCompleted, completedCount } = useProgress();
  const total = criteriaData.length;

  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const incomplete = useMemo(() => {
    return criteriaData.filter((c) => !isCompleted(c.id));
  }, [isCompleted]);

  const completed = useMemo(() => {
    return criteriaData.filter((c) => isCompleted(c.id));
  }, [isCompleted]);

  const topFocus = incomplete.slice(0, 3);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Manager Dashboard</h2>
          <p className="muted">
            Operational snapshot of training completion and focus areas for HP 2026 Quality Excellence.
          </p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Completion</h3>
          <p className="dash-big">{percent}%</p>
          <p className="muted">
            {completedCount}/{total} criteria completed
          </p>

          <div className="dash-progress">
            <div className="dash-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="dash-card">
          <h3>Top Focus Areas</h3>
          <p className="muted">Priority criteria to complete next.</p>

          {topFocus.length ? (
            <ul className="dash-list">
              {topFocus.map((c) => (
                <li key={c.id}>
                  <Link to={`/criteria/${c.id}`} className="dash-link">
                    {c.title}
                  </Link>
                  <span className="dash-sub">{c.points} pts</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="badge badge-complete">✅ No focus areas — all complete</p>
          )}
        </div>

        <div className="dash-card">
          <h3>Completed Criteria</h3>
          <p className="muted">Completed items in this portal instance.</p>

          {completed.length ? (
            <ul className="dash-list">
              {completed.map((c) => (
                <li key={c.id}>
                  <span className="badge badge-complete">✅</span>
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No criteria completed yet.</p>
          )}
        </div>

        <div className="dash-card">
          <h3>In Progress / Not Started</h3>
          <p className="muted">Remaining criteria.</p>

          {incomplete.length ? (
            <ul className="dash-list">
              {incomplete.map((c) => (
                <li key={c.id}>
                  <span className="badge badge-pending">⏳</span>
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="badge badge-complete">✅ All criteria complete</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ManagerDashboard;
