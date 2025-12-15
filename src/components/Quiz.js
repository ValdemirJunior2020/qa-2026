// src/components/Quiz.js
import React, { useMemo, useState, useEffect } from "react";
import quizFallback from "../data/quizData";
import { supabase } from "../supabaseClient";
import useProgress from "../hooks/useProgress";

export default function Quiz({ criterionId }) {
  const { markComplete } = useProgress();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // local answers
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadQuiz() {
      setLoading(true);
      setSubmitted(false);
      setScore(null);
      setAnswers({});

      try {
        const { data, error } = await supabase
          .from("quizzes")
          .select("criterion_id,items")
          .eq("criterion_id", criterionId)
          .maybeSingle();

        if (!alive) return;

        if (!error && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        } else {
          setItems(quizFallback?.[criterionId] || []);
        }
      } catch {
        if (!alive) return;
        setItems(quizFallback?.[criterionId] || []);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (criterionId) loadQuiz();

    return () => {
      alive = false;
    };
  }, [criterionId]);

  const total = items.length;

  const onPick = (qid, idx) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const canSubmit = useMemo(() => {
    if (!items || items.length === 0) return false;
    return items.every((q) => typeof answers[q.id] === "number");
  }, [items, answers]);

  const submit = () => {
    if (!canSubmit) return;

    const correct = items.reduce((sum, q) => {
      return sum + (answers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 80; // adjust threshold if you want

    const scoreObj = {
      passed,
      percent,
      correct,
      totalQuestions: total,
      updatedAt: new Date().toISOString(),
    };

    setScore(scoreObj);
    setSubmitted(true);

    if (passed) {
      markComplete(criterionId, scoreObj);
    }
  };

  if (loading) return <div className="quiz-box">Loading quiz…</div>;

  if (!items || items.length === 0) {
    return <div className="quiz-box quiz-empty">Quiz coming soon.</div>;
  }

  return (
    <div className="quiz-box">
      {items.map((q, idx) => (
        <div key={q.id} style={{ marginBottom: 14 }}>
          <div className="quiz-question">
            <strong>{idx + 1}. {q.question}</strong>
          </div>

          <div className="quiz-options">
            {q.options.map((opt, optIdx) => (
              <label key={optIdx}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === optIdx}
                  onChange={() => onPick(q.id, optIdx)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className="primary-btn" type="button" onClick={submit} disabled={!canSubmit || submitted}>
        Submit Quiz
      </button>

      {submitted && score && (
        <div className="quiz-result">
          <div className="quiz-scoreline">
            Score: <strong>{score.correct}</strong> / <strong>{score.totalQuestions}</strong> ({score.percent}%)
          </div>

          {score.passed ? (
            <div className="quiz-result-correct">✅ PASS — criterion completed!</div>
          ) : (
            <div className="quiz-result-wrong">❌ Not passed — review and try again.</div>
          )}
        </div>
      )}
    </div>
  );
}
