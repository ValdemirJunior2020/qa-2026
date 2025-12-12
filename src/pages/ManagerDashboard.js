// src/pages/ManagerDashboard.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";

function ManagerDashboard() {
  const { isCompleted, completedCount, getScore } = useProgress();
  const total = criteriaData.length;

  const percentComplete = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const scored = useMemo(() => {
    return criteriaData
      .map((c) => {
        const s = getScore(c.id);
        return {
          ...c,
          score: s,
          scorePercent: s?.percent ?? null,
          passed: s?.passed ?? null,
        };
      })
      .filter((c) => c.score); // only those with score saved
  }, [getScore]);

  const topMissed = useMemo(() => {
    // lowest scores first
    return [...scored].sort((a, b) => (a.scorePercent ?? 999) - (b.scorePercent ?? 999)).slice(0, 5);
  }, [scored]);

  const incomplete = useMemo(() => criteriaData.filter((c) => !isCompleted(c.id)), [isCompleted]);
  const completed = useMemo(() => criteriaData.filter((c) => isCompleted(c.id)), [isCompleted]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Manager Dashboard</h2>
          <p className="muted">
            Snapshot of completion and quiz performance for HP 2026 Quality Excellence.
          </p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Completion</h3>
          <p className="dash-big">{percentComplete}%</p>
          <p className="muted">
            {completedCount}/{total} criteria completed
          </p>

          <div className="dash-progress">
            <div className="dash-progress-fill" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>

        <div className="dash-card">
          <h3>Top Missed (Lowest Scores)</h3>
          <p className="muted">Use these for coaching priorities in 2026.</p>

          {topMissed.length ? (
            <ul className="dash-list">
              {topMissed.map((c) => (
                <li key={c.id}>
                  <Link to={`/criteria/${c.id}`} className="dash-link">
                    {c.title}
                  </Link>
                  <span className="dash-sub">{c.scorePercent}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No quiz scores saved yet.</p>
          )}
        </div>

        <div className="dash-card">
          <h3>Completed Criteria</h3>
          <p className="muted">Completed items.</p>

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
          <h3>Remaining Criteria</h3>
          <p className="muted">Not completed yet.</p>

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
