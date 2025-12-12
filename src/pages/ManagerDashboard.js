// src/pages/ManagerDashboard.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";

function csvEscape(value) {
  const v = value === null || value === undefined ? "" : String(value);
  const needsQuotes = /[",\n]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function downloadTextFile(filename, text, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function ManagerDashboard() {
  const { isCompleted, completedCount, getScore, getAttempts } = useProgress();
  const total = criteriaData.length;

  const percentComplete = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const scored = useMemo(() => {
    return criteriaData
      .map((c) => {
        const s = getScore(c.id);
        const a = getAttempts(c.id);
        return {
          ...c,
          score: s,
          scorePercent: s?.percent ?? null,
          passed: s?.passed ?? null,
          attempts: a,
          updatedAt: s?.updatedAt ?? null,
        };
      })
      .filter((c) => c.score);
  }, [getScore, getAttempts]);

  const topMissed = useMemo(() => {
    return [...scored]
      .sort((a, b) => (a.scorePercent ?? 999) - (b.scorePercent ?? 999))
      .slice(0, 5);
  }, [scored]);

  const highAttempts = useMemo(() => {
    return [...scored]
      .filter((c) => c.attempts >= 3)
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 5);
  }, [scored]);

  const incomplete = useMemo(() => criteriaData.filter((c) => !isCompleted(c.id)), [isCompleted]);
  const completed = useMemo(() => criteriaData.filter((c) => isCompleted(c.id)), [isCompleted]);

  const handleExportCsv = () => {
    const header = [
      "Criterion ID",
      "Criterion Title",
      "Points",
      "Completed (Certified)",
      "Quiz Taken",
      "Pass/Fail",
      "Score %",
      "Correct",
      "Total Questions",
      "Attempts",
      "Last Updated",
    ];

    const rows = criteriaData.map((c) => {
      const s = getScore(c.id);
      const a = getAttempts(c.id);
      const completedFlag = isCompleted(c.id);

      const quizTaken = s ? "YES" : "NO";
      const passFail = s ? (s.passed ? "PASS" : "FAIL") : "";
      const scorePercent = s ? s.percent : "";
      const correct = s ? s.correct : "";
      const totalQuestions = s ? s.totalQuestions : "";
      const updatedAt = s ? s.updatedAt : "";

      return [
        c.id,
        c.title,
        c.points,
        completedFlag ? "YES" : "NO",
        quizTaken,
        passFail,
        scorePercent,
        correct,
        totalQuestions,
        a,
        updatedAt,
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const filename = `HP_2026_Training_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadTextFile(filename, csv);
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Manager Dashboard</h2>
          <p className="muted">
            Completion + quiz results + attempts (coaching insight) for HP 2026 Quality Excellence.
          </p>
        </div>

        <button type="button" className="secondary-btn" onClick={handleExportCsv}>
          Export CSV Report
        </button>
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
          <p className="muted">Primary coaching priorities.</p>

          {topMissed.length ? (
            <ul className="dash-list">
              {topMissed.map((c) => (
                <li key={c.id}>
                  <Link to={`/criteria/${c.id}`} className="dash-link">
                    {c.title}
                  </Link>

                  <span className="dash-sub">Attempts: {c.attempts}</span>

                  {c.passed === true && <span className="badge badge-pass">PASS {c.scorePercent}%</span>}
                  {c.passed === false && <span className="badge badge-fail">FAIL {c.scorePercent}%</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No quiz scores saved yet.</p>
          )}
        </div>

        <div className="dash-card">
          <h3>High Attempts (Struggle Signals)</h3>
          <p className="muted">Anything 3+ attempts needs targeted coaching.</p>

          {highAttempts.length ? (
            <ul className="dash-list">
              {highAttempts.map((c) => (
                <li key={c.id}>
                  <Link to={`/criteria/${c.id}`} className="dash-link">
                    {c.title}
                  </Link>

                  <span className="badge badge-pending">🔥 {c.attempts} attempts</span>

                  {c.passed === true && <span className="badge badge-pass">PASS {c.scorePercent}%</span>}
                  {c.passed === false && <span className="badge badge-fail">FAIL {c.scorePercent}%</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No criteria have 3+ attempts yet.</p>
          )}
        </div>

        <div className="dash-card">
          <h3>Completed Criteria</h3>
          <p className="muted">Certified items.</p>

          {completed.length ? (
            <ul className="dash-list">
              {completed.map((c) => {
                const s = getScore(c.id);
                const a = getAttempts(c.id);
                return (
                  <li key={c.id}>
                    <span className="badge badge-complete">✅</span>
                    <span>{c.title}</span>
                    <span className="dash-sub">Attempts: {a}</span>
                    {s?.passed === true && <span className="badge badge-pass">PASS {s.percent}%</span>}
                    {s?.passed === false && <span className="badge badge-fail">FAIL {s.percent}%</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted">No criteria completed yet.</p>
          )}
        </div>

        <div className="dash-card">
          <h3>Remaining Criteria</h3>
          <p className="muted">Not certified yet.</p>

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
