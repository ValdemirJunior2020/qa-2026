// src/components/Quiz.js
import React, { useEffect, useMemo, useState } from "react";
import quizFallback from "../data/quizData";
import useProgress from "../hooks/useProgress";
import { supabase } from "../supabaseClient";

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

export default function Quiz({ criterionId }) {
  const { markComplete } = useProgress();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  // Load quiz questions from Supabase (active only)
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);
      setFinished(false);
      setIndex(0);
      setSelected(null);
      setCorrect(0);

      try {
        const { data, error: supaErr } = await supabase
          .from("quiz_questions")
          .select("id,criterion_id,question,options,correct_index,active,updated_at")
          .eq("criterion_id", criterionId)
          .eq("active", true)
          .order("updated_at", { ascending: true });

        if (!alive) return;

        if (supaErr) {
          setRows([]);
          setError(supaErr.message || "Unable to load quiz from Supabase.");
        } else {
          setRows(data || []);
        }
      } catch (e) {
        if (!alive) return;
        setRows([]);
        setError(e?.message || "Unexpected quiz load error.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (criterionId) load();

    return () => {
      alive = false;
    };
  }, [criterionId]);

  // Choose Supabase quiz if available, else fallback file
  const questions = useMemo(() => {
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        question: r.question,
        options: safeArray(r.options),
        correctIndex: Number.isFinite(r.correct_index) ? r.correct_index : 0,
      }));
    }
    return quizFallback?.[criterionId] || [];
  }, [rows, criterionId]);

  const total = questions.length;

  const current = total > 0 ? questions[index] : null;

  const submitAnswer = () => {
    if (!current) return;
    if (selected === null) return;

    const isRight = selected === current.correctIndex;
    const nextCorrect = isRight ? correct + 1 : correct;

    const nextIndex = index + 1;

    if (nextIndex >= total) {
      setCorrect(nextCorrect);
      setFinished(true);

      const percent = total === 0 ? 0 : Math.round((nextCorrect / total) * 100);
      const passed = percent >= 80; // ✅ you can change pass threshold here

      // Save score + mark completion only if PASSED
      const scoreObj = {
        passed,
        percent,
        correct: nextCorrect,
        totalQuestions: total,
        updatedAt: new Date().toISOString(),
      };

      if (passed) {
        markComplete(criterionId, scoreObj);
      }

      return;
    }

    setCorrect(nextCorrect);
    setIndex(nextIndex);
    setSelected(null);
  };

  if (loading) return <div className="quiz-box">Loading quiz…</div>;

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-box">
        <div className="quiz-empty">Quiz coming soon.</div>
        {error ? <div className="muted" style={{ marginTop: 8 }}>⚠️ {error}</div> : null}
      </div>
    );
  }

  if (finished) {
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    const passed = percent >= 80;

    return (
      <div className="quiz-box quiz-finished-block">
        <h3 className="quiz-finished-title">✅ Quiz Completed</h3>
        <div className="quiz-scoreline">
          Score: <strong>{correct}</strong> / <strong>{total}</strong> ({percent}%)
        </div>
        <div className="quiz-result" style={{ marginTop: 8 }}>
          {passed ? (
            <span className="quiz-result-correct">✅ PASS — progress saved</span>
          ) : (
            <span className="quiz-result-wrong">❌ FAIL — try again to pass</span>
          )}
        </div>

        <div className="quiz-finished-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setCorrect(0);
              setFinished(false);
            }}
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <div className="quiz-counter">
        Question {index + 1} of {total}
      </div>

      <div className="quiz-question">{current.question}</div>

      {/* ✅ one below the other */}
      <div className="quiz-options" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current.options.map((opt, i) => (
          <label
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: selected === i ? "#eef2ff" : "#fff",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={`q-${current.id}`}
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={submitAnswer}
        disabled={selected === null}
        style={{ width: "100%", marginTop: 12 }}
      >
        Submit
      </button>

      {error ? <div className="muted" style={{ marginTop: 8 }}>⚠️ {error}</div> : null}
    </div>
  );
}
