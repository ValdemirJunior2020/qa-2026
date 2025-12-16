// src/pages/DetailPage.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import criteriaData from "../data/criteriaData";
import trainingVideos from "../data/trainingVideos";

import { toYouTubeEmbedUrl } from "../utils/youtube";
import useProgress from "../hooks/useProgress"; // ✅ DEFAULT import

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Hooks MUST always run (no early returns before these)
  const { setCompleted, isCompleted } = useProgress();

  const criterion = useMemo(() => {
    return (criteriaData || []).find((c) => c.id === id) || null;
  }, [id]);

  // Safe arrays even if criterion is missing
  const checklist = useMemo(() => {
    if (!criterion) return [];
    if (Array.isArray(criterion.checklist)) return criterion.checklist;
    if (Array.isArray(criterion.items)) return criterion.items;
    if (Array.isArray(criterion.bullets)) return criterion.bullets;
    if (Array.isArray(criterion.expectations)) return criterion.expectations;
    return [];
  }, [criterion]);

  const quizQuestions = useMemo(() => {
    if (!criterion) return [];
    if (Array.isArray(criterion.questions)) return criterion.questions;
    if (Array.isArray(criterion.quiz)) return criterion.quiz;
    if (Array.isArray(criterion.quizQuestions)) return criterion.quizQuestions;
    return [];
  }, [criterion]);

  // Initialize UI state (must not depend on conditional hooks)
  const [checked, setChecked] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setChecked(checklist.map(() => false));
    setAnswers(quizQuestions.map(() => null));
  }, [id, checklist, quizQuestions]);

  const completed = criterion ? isCompleted(criterion.id) : false;

  const videoUrlRaw = criterion ? trainingVideos?.[criterion.id] || "" : "";
  const embedUrl = toYouTubeEmbedUrl(videoUrlRaw);

  const toggleCheck = (idx) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const answerQuestion = (qIndex, optionIndex) => {
    setAnswers((prev) => prev.map((v, i) => (i === qIndex ? optionIndex : v)));
  };

  const allChecklistDone = checked.length ? checked.every(Boolean) : true;
  const allQuizAnswered = answers.length ? answers.every((a) => a !== null) : true;

  const markDone = () => {
    if (!criterion) return;
    if (!allChecklistDone || !allQuizAnswered) return;
    setCompleted(criterion.id, true);
  };

  // ✅ Now it's safe to render "not found" (no hook ordering issues)
  if (!criterion) {
    return (
      <div className="page">
        <h2>Criteria not found</h2>
        <p className="muted">That criteria ID does not exist.</p>
        <button className="primary-btn" onClick={() => navigate("/criteria")}>
          Back to Criteria
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detail-head">
        <div>
          <h1 style={{ margin: 0 }}>{criterion.title || "Criteria"}</h1>
          {criterion.subtitle && <p className="muted">{criterion.subtitle}</p>}
          {criterion.description && <p className="muted">{criterion.description}</p>}
        </div>

        <div className="detail-actions">
          <button className="btn" onClick={() => navigate("/criteria")}>
            ← Back
          </button>

          <button
            className={`primary-btn ${completed ? "primary-btn--done" : ""}`}
            onClick={markDone}
            disabled={!allChecklistDone || !allQuizAnswered}
          >
            {completed ? "✅ Completed" : "Mark Complete"}
          </button>
        </div>
      </div>

      {/* Video (small) */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title">Training Video</div>

        {!embedUrl ? (
          <p className="muted" style={{ margin: 0 }}>
            No video linked yet for <b>{criterion.id}</b>.
          </p>
        ) : (
          <div className="video-wrap">
            <iframe
              className="video-iframe"
              src={embedUrl}
              title={criterion.title || "Training Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title">Checklist</div>

        {checklist.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No checklist items found for this criteria.
          </p>
        ) : (
          <div className="checklist">
            {checklist.map((item, idx) => (
              <label key={idx} className={`check-row ${checked[idx] ? "check-row--on" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!checked[idx]}
                  onChange={() => toggleCheck(idx)}
                />
                <span>{String(item)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Quiz (stacked) */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title">Quick Quiz</div>

        {quizQuestions.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No quiz questions found for this criteria.
          </p>
        ) : (
          <div className="quiz-stack">
            {quizQuestions.map((q, qIndex) => {
              const qText = q.question || q.text || `Question ${qIndex + 1}`;
              const options = q.options || q.choices || [];
              return (
                <div key={qIndex} className="quiz-card">
                  <div className="quiz-q">
                    {qIndex + 1}. {qText}
                  </div>

                  <div className="quiz-options">
                    {options.map((opt, optIndex) => {
                      const selected = answers[qIndex] === optIndex;
                      return (
                        <button
                          key={optIndex}
                          type="button"
                          className={`quiz-opt ${selected ? "quiz-opt--on" : ""}`}
                          onClick={() => answerQuestion(qIndex, optIndex)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 10 }} className="muted">
          {allChecklistDone ? "✅ Checklist done" : "⬜ Finish checklist"} •{" "}
          {allQuizAnswered ? "✅ Quiz answered" : "⬜ Answer all questions"}
        </div>
      </div>
    </div>
  );
}
