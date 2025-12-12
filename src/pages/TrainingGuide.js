// src/pages/TrainingGuide.js
import React, { useMemo } from "react";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";

function TrainingGuide() {
  const { completed } = useProgress();

  const items = useMemo(() => {
    return criteriaData.map((c) => {
      const done = !!completed?.[c.id];
      return { ...c, done };
    });
  }, [completed]);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Training Guide</h1>
        <p className="muted">
          Use this page to study each criterion and track certification progress.
        </p>
      </div>

      <div className="grid">
        {items.map((c) => (
          <div key={c.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, flex: 1 }}>{c.title}</h3>
              <span className="badge">
                {c.done ? "✅ Certified" : "⏳ Not Certified"}
              </span>
            </div>

            <p className="muted" style={{ marginTop: 8 }}>
              {c.shortDescription}
            </p>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn" href={`/criteria/${c.id}`}>
                Open Criterion
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingGuide;
