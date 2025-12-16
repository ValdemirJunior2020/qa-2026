// src/pages/Dashboard.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useProgress from "../hooks/useProgress";
import { calculateReadiness } from "../utils/readiness";

// IMPORTANT: your criteriaData file exports a NAMED export: { criteriaData }
// If your file is different, adjust this line.
import { criteriaData } from "../data/criteriaData";

// trainingVideos uses DEFAULT export (your file: export default trainingVideos)
import trainingVideos from "../data/trainingVideos";

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

function toYouTubeEmbed(url) {
  if (!url) return null;

  // supports:
  // https://youtu.be/ID
  // https://www.youtube.com/watch?v=ID
  // https://www.youtube.com/embed/ID
  try {
    const u = new URL(url);

    // youtu.be/ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // already embed
      if (u.pathname.startsWith("/embed/")) return url;
    }

    return url;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const { scores, completedCount, totalCriteria } = useProgress();

  const readiness = useMemo(() => {
    return calculateReadiness({
      getScore: (criterionId) => scores?.[criterionId] || null,
    });
  }, [scores]);

  const { readinessPercent, level, earnedPoints, totalPoints, gaps, scoredRows } = readiness;

  // Last 3 attempts: sort by updatedAt / passedAt (whichever exists)
  const lastAttempts = useMemo(() => {
    const rows = (scoredRows || [])
      .filter((r) => r?.score)
      .map((r) => {
        const updatedAt = r.score?.updatedAt || r.score?.passedAt || null;
        return {
          id: r.id,
          title: r.title,
          passed: r.score?.passed === true,
          percent: r.score?.percent ?? null,
          correct: r.score?.correct ?? null,
          totalQuestions: r.score?.totalQuestions ?? r.score?.total ?? null,
          updatedAt,
        };
      })
      .sort((a, b) => {
        const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return tb - ta;
      });

    return rows.slice(0, 3);
  }, [scoredRows]);

  // Quick “continue” list (top 5 gaps)
  const continueList = useMemo(() => gaps.slice(0, 5), [gaps]);

  // Videos: show only those that exist for your criteria ids
  const videoCards = useMemo(() => {
    return criteriaData
      .filter((c) => trainingVideos?.[c.id])
      .map((c) => {
        const embed = toYouTubeEmbed(trainingVideos[c.id]);
        return {
          id: c.id,
          title: c.title,
          embed,
          url: trainingVideos[c.id],
        };
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Student Dashboard</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Progress: <strong>{completedCount}</strong> / <strong>{totalCriteria}</strong> criteria completed
          </p>
        </div>

        <Link to="/criteria" className="primary-btn">
          Continue Training
        </Link>
      </div>

      <div className="dash-grid">
        {/* Readiness card */}
        <div className="dash-card readiness-card">
          <div className="readiness-top">
            <div>
              <h3 style={{ margin: 0 }}>2026 Readiness Score</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                Weighted by criterion points (PASS = earned points).
              </p>
            </div>

            <span className={`badge readiness-badge readiness-${level.key}`}>
              {level.label}
            </span>
          </div>

          <div className="readiness-metric">
            <div className="readiness-percent">{readinessPercent}%</div>
            <div className="muted">
              Earned <strong>{earnedPoints}</strong> / <strong>{totalPoints}</strong> points
            </div>
          </div>

          <div className="dash-progress readiness-progress">
            <div className="dash-progress-fill" style={{ width: `${readinessPercent}%` }} />
          </div>

          <div style={{ marginTop: 10 }}>
            <span className="muted">Tip:</span>{" "}
            Focus on the highest-point gaps first.
          </div>
        </div>

        {/* Last 3 attempts */}
        <div className="dash-card">
          <h3 style={{ marginTop: 0 }}>Last 3 Quiz Attempts</h3>

          {lastAttempts.length === 0 ? (
            <p className="muted">No quiz attempts yet. Start with any criterion.</p>
          ) : (
            <ul className="dash-list">
              {lastAttempts.map((a) => (
                <li key={a.id}>
                  <Link to={`/criteria/${a.id}`} className="dash-link">
                    {a.title}
                  </Link>

                  <span className="dash-sub">
                    {a.passed ? "✅ PASS" : "❌ FAIL"}
                    {a.percent !== null ? ` • ${a.percent}%` : ""}
                    {a.correct !== null && a.totalQuestions !== null
                      ? ` • ${a.correct}/${a.totalQuestions}`
                      : ""}
                    {" • "}
                    {formatDate(a.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Continue learning */}
        <div className="dash-card">
          <h3 style={{ marginTop: 0 }}>Continue Learning</h3>

          {continueList.length === 0 ? (
            <p className="muted">✅ You passed everything. Amazing.</p>
          ) : (
            <>
              <p className="muted" style={{ marginTop: 6 }}>
                Top gaps (highest points first):
              </p>

              <ul className="dash-list">
                {continueList.map((g) => (
                  <li key={g.id}>
                    <Link to={`/criteria/${g.id}`} className="dash-link">
                      {g.title}
                    </Link>

                    <span className="dash-sub">
                      {g.status === "FAILED" ? "❌ FAILED" : "⏳ NOT ATTEMPTED"} • {g.points} pts
                      {g.scorePercent !== null ? ` • ${g.scorePercent}%` : ""}
                      {trainingVideos?.[g.id] ? " • 🎥 Video available" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Training videos */}
        <div className="dash-card">
          <h3 style={{ marginTop: 0 }}>Training Videos</h3>
          <p className="muted" style={{ marginTop: 6 }}>
            These appear only for criteria that have a video link.
          </p>

          {videoCards.length === 0 ? (
            <p className="muted">No videos configured yet.</p>
          ) : (
            <div className="video-grid">
              {videoCards.map((v) => (
                <div key={v.id} className="video-card">
                  <div className="video-card-top">
                    <div>
                      <div style={{ fontWeight: 900 }}>{v.title}</div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        <Link to={`/criteria/${v.id}`} className="dash-link">
                          Open Criterion
                        </Link>
                      </div>
                    </div>
                  </div>

                  {v.embed ? (
                    <div className="video-embed">
                      <iframe
                        title={v.title}
                        src={v.embed}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="muted">Video link is invalid.</p>
                  )}

                  <div style={{ marginTop: 8 }}>
                    <a className="resource-link" href={v.url} target="_blank" rel="noreferrer">
                      Open on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
