// src/pages/TrainingGuide.js
import React from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import resourcesData from "../data/resourcesData";
import useProgress from "../hooks/useProgress";

function TrainingGuide() {
  const { isCompleted } = useProgress();
  const globalPdf = resourcesData.global.trainingGuidePdf;

  const guide = criteriaData.map((c) => ({
    id: c.id,
    title: c.title,
    points: c.points,
    sections: c.trainingSections || [],
  }));

  return (
    <section className="page">
      <h2>HP 2026 Training Guide</h2>
      <p className="muted">
        This page organizes training topics by QA criterion. Resources will grow
        over time (PDF references, examples, and optional videos).
      </p>

      <div className="global-resources">
        <h3 className="global-title">Global Reference</h3>
        <a className="resource-btn" href={globalPdf.url} target="_blank" rel="noreferrer">
          📄 {globalPdf.label}
        </a>
      </div>

      <div className="guide-grid">
        {guide.map((item) => {
          const done = isCompleted(item.id);

          return (
            <div className="guide-card" key={item.id}>
              <div className="guide-card-top">
                <div>
                  <div className="guide-title-row">
                    <h3 className="guide-title">{item.title}</h3>
                    {done && <span className="badge badge-complete">✅ Completed</span>}
                  </div>
                  <p className="guide-points">{item.points} points</p>
                </div>

                <Link className="secondary-btn" to={`/criteria/${item.id}`}>
                  Open Criterion
                </Link>
              </div>

              {item.sections.length > 0 ? (
                <ul className="guide-list">
                  {item.sections.map((sec, idx) => (
                    <li key={idx}>{sec}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Training sections will be added here.</p>
              )}

              <div className="resource-row">
                <a className="resource-btn" href={globalPdf.url} target="_blank" rel="noreferrer">
                  📄 PDF
                </a>
                <button className="resource-btn" type="button" disabled>
                  🎥 Video (soon)
                </button>
                <button className="resource-btn" type="button" disabled>
                  ✅ Examples (soon)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrainingGuide;
