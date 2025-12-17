// src/pages/DetailPage.js
import React, { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import criteriaData from "../data/criteriaData";
import expectationsData from "../data/expectationsData";
import trainingVideos from "../data/trainingVideos";

import Quiz from "../components/Quiz";
import useProgress from "../hooks/useProgress";

function getYouTubeEmbed(url) {
  if (!url) return "";
  // supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
  const ytIdMatch =
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/) ||
    url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/) ||
    url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);

  const id = ytIdMatch?.[1];
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}`;
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isCompleted, markComplete } = useProgress();

  const meta = useMemo(() => criteriaData.find((c) => c.id === id) || null, [id]);
  const exp = expectationsData?.[id] || null;

  const [msg, setMsg] = useState("");

  const done = isCompleted(id);

  // video
  const rawVideo = trainingVideos?.[id] || "";
  const embedUrl = getYouTubeEmbed(rawVideo);

  if (!meta) {
    return (
      <div className="page">
        <div className="card">
          <h2>Not found</h2>
          <p className="muted">This criterion doesn’t exist.</p>
          <Link to="/criteria" className="nav__link">← Back to QA Criteria</Link>
        </div>
      </div>
    );
  }

  const title = exp?.title || meta.title;

  const handleMarkComplete = async () => {
    setMsg("");
    await markComplete(id, true);
    setMsg("✅ Marked complete!");
  };

  return (
    <div className="page">
      <div className="card">
        <Link to="/criteria" className="back-link">← Back to QA Criteria</Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: "10px 0" }}>{title}</h1>
          <span className="pill">
            {done ? "🏆 Certified" : "⏳ Not Certified"}
          </span>
        </div>

        {/* Training Video */}
        <h3 style={{ marginTop: 14 }}>🎥 Training Video</h3>

        {!embedUrl ? (
          <p className="muted">No video linked yet for this criterion.</p>
        ) : (
          <div className="videoWrap">
            <iframe
              className="videoFrame"
              src={embedUrl}
              title={`${title} training video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {/* What Good Looks Like */}
        <h3 style={{ marginTop: 18 }}>✅ What “Good” Looks Like</h3>

        {!exp ? (
          <p className="muted">No expectation content found for this criterionId: {id}</p>
        ) : (
          <>
            {Array.isArray(exp.sections) &&
              exp.sections.map((s, idx) => (
                <div key={idx} style={{ marginTop: 12 }}>
                  <h4 style={{ margin: "8px 0" }}>{s.heading}</h4>
                  <ul>
                    {(s.bullets || []).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}

            {!!(exp.approvedPhrases?.length) && (
              <div style={{ marginTop: 18 }}>
                <h3>🟢 Approved Phrases</h3>
                <ul>
                  {exp.approvedPhrases.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {!!(exp.commonMisses?.length) && (
              <div style={{ marginTop: 18 }}>
                <h3>🔴 Common Misses</h3>
                <ul>
                  {exp.commonMisses.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {!!(exp.sources?.length) && (
              <div style={{ marginTop: 18 }}>
                <h3>📌 Sources</h3>
                <ul>
                  {exp.sources.map((src, i) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Quiz */}
        <div style={{ marginTop: 22 }}>
          <h3>🧠 Knowledge Check</h3>
          <Quiz criterionId={id} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
          <button className="btn" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <button className="primary-btn" type="button" onClick={handleMarkComplete}>
            Mark Complete
          </button>

          {msg && <span className="muted">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
