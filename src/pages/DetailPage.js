// src/pages/DetailPage.js
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { criteriaData } from "../data/criteriaData";
import trainingVideos from "../data/trainingVideos";

function getYouTubeId(url = "") {
  // supports:
  // https://youtu.be/VIDEOID
  // https://www.youtube.com/watch?v=VIDEOID
  // https://www.youtube.com/embed/VIDEOID
  try {
    if (!url) return "";
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }
    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1].split("&")[0];
    }
    if (url.includes("/embed/")) {
      return url.split("/embed/")[1].split("?")[0];
    }
    return "";
  } catch {
    return "";
  }
}

export default function DetailPage() {
  const { id } = useParams();

  const criterion = useMemo(() => criteriaData.find((c) => c.id === id), [id]);

  const videoUrl = trainingVideos?.[id] || "";
  const videoId = getYouTubeId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : "";

  // simple quiz state
  const quiz = criterion?.quiz || [];
  const [answers, setAnswers] = useState({}); // { [index]: optionIndex }
  const [submitted, setSubmitted] = useState(false);

  if (!criterion) {
    return (
      <div className="page">
        <Link to="/criteria" className="back-link">
          ← Back to QA Criteria
        </Link>
        <h2>Not found</h2>
        <p className="muted">This criterion id does not exist: {id}</p>
      </div>
    );
  }

  const score = submitted
    ? quiz.reduce((acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0), 0)
    : 0;

  return (
    <div className="page criteria-detail">
      <Link to="/criteria" className="back-link">
        ← Back to QA Criteria
      </Link>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: "0.25rem 0 0" }}>{criterion.title}</h1>
        <span className="badge badge-pending">⏳ Not Certified</span>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        {criterion.short}
      </p>

      {/* Training Video */}
      <div className="detail-section">
        <h3 style={{ display: "flex", gap: 10, alignItems: "center" }}>
          🎥 Training Video
        </h3>

        {!embedUrl ? (
          <p className="muted">No video linked yet for this criterion.</p>
        ) : (
          <div className="video-wrap">
            <iframe
              className="video-iframe"
              src={embedUrl}
              title={`${criterion.title} Training Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* What Good Looks Like */}
      <div className="detail-section">
        <h3>✅ What “Good” Looks Like</h3>
        <ul>
          {(criterion.whatGoodLooksLike || []).map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      </div>

      {/* Approved Phrases */}
      <div className="detail-section">
        <h3>🟢 Approved Phrases</h3>
        <ul>
          {(criterion.approvedPhrases || []).map((x, idx) => (
            <li key={idx}>
              <span className="phrase-pill">{x}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Misses */}
      <div className="detail-section">
        <h3>🔴 Common Misses</h3>
        <ul>
          {(criterion.commonMisses || []).map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div className="detail-section">
        <h3>💡 Examples</h3>
        <ul>
          {(criterion.examples || []).map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      </div>

      {/* Knowledge Check */}
      <div className="detail-section">
        <h3>🧠 Knowledge Check</h3>

        {quiz.length === 0 ? (
          <p className="muted">No quiz questions for this criterion yet.</p>
        ) : (
          <form
            className="quiz-box"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            {quiz.map((q, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div className="quiz-question">
                  <strong>
                    {i + 1}. {q.q}
                  </strong>
                </div>

                <div className="quiz-options">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="quiz-option">
                      <input
                        type="radio"
                        name={`q-${i}`}
                        checked={answers[i] === oi}
                        onChange={() => setAnswers((p) => ({ ...p, [i]: oi }))}
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div
                    className={
                      answers[i] === q.answerIndex ? "quiz-result quiz-result-correct" : "quiz-result quiz-result-wrong"
                    }
                  >
                    {answers[i] === q.answerIndex ? "✅ Correct" : `❌ Correct answer: ${q.options[q.answerIndex]}`}
                  </div>
                )}
              </div>
            ))}

            <button className="primary-btn" type="submit">
              Submit Quiz
            </button>

            {submitted && (
              <div className="quiz-scoreline">
                Score: <strong>{score}</strong> / {quiz.length}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
