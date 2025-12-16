// src/pages/TrainingGuide.js
import React from "react";
import { Link } from "react-router-dom";

import criteriaData from "../data/criteriaData";
import trainingVideos from "../data/trainingVideos";
import { toYouTubeEmbedUrl } from "../utils/youtube";
import useProgress from "../hooks/useProgress";

export default function TrainingGuide() {
  const { isCompleted } = useProgress();

  return (
    <div className="page">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Training Guide</h1>
        <p className="muted">
          Study each criterion below. Watch the video, read the guidance, then
          click “Open Criterion” to complete certification.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        {criteriaData.map((c) => {
          const completed = isCompleted(c.id);
          const videoUrl = trainingVideos?.[c.id];
          const embedUrl = toYouTubeEmbedUrl(videoUrl);

          return (
            <div key={c.id} className="card" style={{ marginBottom: 16 }}>
              <div className="guide-row">
                <div className="guide-main">
                  <h2 style={{ marginTop: 0 }}>
                    {c.title}{" "}
                    {completed ? (
                      <span className="badge badge--ok">Certified</span>
                    ) : (
                      <span className="badge badge--warn">Not Certified</span>
                    )}
                  </h2>

                  {c.subtitle && <p className="muted">{c.subtitle}</p>}

                  {/* 🎥 Video */}
                  {embedUrl ? (
                    <div className="video-wrap small">
                      <iframe
                        className="video-iframe"
                        src={embedUrl}
                        title={c.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="muted">No training video yet.</p>
                  )}

                  {/* 🎙️ Narrator script */}
                  {c.narrator && (
                    <div className="narrator-box">
                      <strong>Narrator Guidance</strong>
                      <p>{c.narrator}</p>
                    </div>
                  )}
                </div>

                {/* ACTION */}
                <div className="guide-action">
                  <Link to={`/criteria/${c.id}`} className="primary-btn">
                    Open Criterion →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
