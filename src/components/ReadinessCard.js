// src/components/ReadinessCard.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useProgress from "../hooks/useProgress";
import { calculateReadiness } from "../utils/readiness";

function ReadinessCard({ showGaps = true, maxGaps = 4 }) {
  // ✅ Use the scores map from ProgressContext
  const { scores } = useProgress();

  const readiness = useMemo(() => {
    return calculateReadiness(scores);
  }, [scores]);

  const { totalPoints, earnedPoints, readinessPercent, level, gaps } = readiness;

  return (
    <div className="dash-card readiness-card">
      <div className="readiness-top">
        <div>
          <h3>2026 Readiness Score</h3>
          <p className="muted">Weighted by criterion points (PASS = earned points).</p>
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
        <div
          className="dash-progress-fill"
          style={{ width: `${readinessPercent}%` }}
        />
      </div>

      {showGaps && (
        <div className="readiness-gaps">
          <h4 className="readiness-subtitle">Top Gaps</h4>

          {gaps.length === 0 ? (
            <p className="muted">✅ No gaps — all criteria are passed.</p>
          ) : (
            <ul className="dash-list">
              {gaps.slice(0, maxGaps).map((g) => (
                <li key={g.id}>
                  <Link to={`/criteria/${g.id}`} className="dash-link">
                    {g.title}
                  </Link>

                  <span className="dash-sub">
                    {g.status === "FAILED" ? "❌ FAILED" : "⏳ NOT ATTEMPTED"} • {g.points}{" "}
                    pts
                    {g.scorePercent !== null ? ` • ${g.scorePercent}%` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadinessCard;
