// src/components/Quiz.js
import React, { useMemo, useState } from "react";
import quizData from "../data/quizData";

/**
 * Props:
 *  - criterionId: string (must match criteriaData IDs and quizData keys)
 */
function Quiz({ criterionId }) {
  const questions = useMemo(() => {
    if (!criterionId) return [];
    return quizData?.[criterionId] || [];
  }, [criterionId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex] || null;

  function resetQuiz() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
  }

  function submitAnswer() {
    if (selectedIndex === null || !current) return;

    const isCorrect = selectedIndex === current.correctIndex;
    setSubmitted(true);

    if (isCorrect) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    if (!questions.length) return;

    const next = currentIndex + 1;

    if (next >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex(next);
    setSelectedIndex(null);
    setSubmitted(false);
  }

  if (!criterionId) {
    return (
      <div className="quiz">
        <p>Quiz coming soon.</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="quiz">
        <p>Quiz coming soon for this criteria.</p>
      </div>
    );
  }

  if (finished) {
    const total = questions.length;
    const percent = Math.round((correctCount / total) * 100);

    return (
      <div className="quiz">
        <h3 style={{ marginTop: 0 }}>✅ Quiz Complete</h3>
        <p>
          Score: <strong>{correctCount}</strong> / {total} ({percent}%)
        </p>

        <button type="button" onClick={resetQuiz}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
          <h3 style={{ marginTop: 6 }}>{current.question}</h3>
        </div>

        <button type="button" onClick={resetQuiz} style={{ height: 36 }}>
          Reset Quiz
        </button>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {current.options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === current.correctIndex;

          let border = "1px solid #ddd";
          let background = "#fff";

          if (submitted) {
            if (isCorrect) {
              border = "1px solid #22c55e";
              background = "rgba(34, 197, 94, 0.08)";
            } else if (isSelected && !isCorrect) {
              border = "1px solid #ef4444";
              background = "rgba(239, 68, 68, 0.08)";
            }
          } else if (isSelected) {
            border = "1px solid #2563eb";
            background = "rgba(37, 99, 235, 0.08)";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (submitted) return;
                setSelectedIndex(idx);
              }}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 10,
                border,
                background,
                cursor: submitted ? "not-allowed" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        {!submitted ? (
          <button
            type="button"
            onClick={submitAnswer}
            disabled={selectedIndex === null}
          >
            Submit Answer
          </button>
        ) : (
          <button type="button" onClick={nextQuestion}>
            Next
          </button>
        )}
      </div>

      {submitted && (
        <div style={{ marginTop: 10 }}>
          {selectedIndex === current.correctIndex ? (
            <div style={{ color: "#16a34a" }}>✅ Correct</div>
          ) : (
            <div style={{ color: "#dc2626" }}>
              ❌ Not quite — correct answer highlighted above
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
