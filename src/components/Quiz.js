// src/components/Quiz.js
import React, { useMemo, useState } from "react";
import useProgress from "../hooks/useProgress";
import quizData from "../data/quizData";

function Quiz({ criterionId }) {
  const { markComplete } = useProgress();

  const questions = useMemo(() => {
    return quizData?.[criterionId] || [];
  }, [criterionId]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!criterionId) return null;

  if (!questions.length) {
    return <p className="muted">🧠 Quiz coming soon.</p>;
  }

  const onPick = (qId, idx) => {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const score = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct += 1;
    });
    const total = questions.length;
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 80; // you can change pass rule here
    return { correct, total, percent, passed };
  };

  const handleSubmit = () => {
    const s = score();
    setSubmitted(true);

    // ✅ Save into ProgressContext (localStorage)
    markComplete(criterionId, {
      passed: s.passed,
      percent: s.percent,
      correct: s.correct,
      totalQuestions: s.total,
      updatedAt: new Date().toISOString(),
    });
  };

  const s = submitted ? score() : null;

  return (
    <div className="quiz">
      {questions.map((q, qi) => (
        <div key={q.id} className="quiz-q">
          <h4>
            {qi + 1}. {q.question}
          </h4>

          <div className="quiz-options">
            {q.options.map((opt, idx) => {
              const checked = answers[q.id] === idx;
              const isCorrect = submitted && idx === q.correctIndex;
              const isWrong = submitted && checked && idx !== q.correctIndex;

              return (
                <label
                  key={idx}
                  className={[
                    "quiz-option",
                    checked ? "is-checked" : "",
                    isCorrect ? "is-correct" : "",
                    isWrong ? "is-wrong" : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={checked || false}
                    onChange={() => onPick(q.id, idx)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 14 }}>
        {!submitted ? (
          <button className="btn" onClick={handleSubmit}>
            Submit Quiz
          </button>
        ) : (
          <div className="notice">
            {s?.passed ? "✅ PASS" : "❌ FAIL"} — {s?.correct}/{s?.total} (
            {s?.percent}%)
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
