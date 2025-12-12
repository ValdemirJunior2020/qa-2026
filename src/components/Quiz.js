// src/components/Quiz.js
import React, { useMemo, useState } from "react";
import quizData from "../data/quizData";

/**
 * Props:
 * - criterionId (string) required
 * - onPassed (optional function) called when user finishes quiz successfully
 *
 * Notes:
 * - Uses your existing src/data/quizData.js
 * - No progressStorage dependency (keeps it stable right now)
 */

function Quiz({ criterionId, onPassed }) {
  const questions = useMemo(() => {
    return quizData?.[criterionId] || [];
  }, [criterionId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null); // "correct" | "wrong" | null
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    if (selectedIndex === currentQuestion.correctIndex) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  const handleNext = () => {
    setResult(null);
    setSelectedIndex(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setFinished(true);
    if (typeof onPassed === "function") onPassed(criterionId);
  };

  // ✅ Keep hooks above, then render “coming soon”
  if (!questions.length) {
    return (
      <p className="quiz-empty">
        Quiz questions for this criterion will be added in the next phase of the
        2026 portal.
      </p>
    );
  }

  if (!currentQuestion) {
    return (
      <p className="quiz-empty">
        Quiz is not available for this criterion yet.
      </p>
    );
  }

  return (
    <div className="quiz-box">
      {!finished ? (
        <>
          <p className="quiz-counter">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <p className="quiz-question">{currentQuestion.question}</p>

          <form onSubmit={handleSubmit}>
            <div className="quiz-options">
              {currentQuestion.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={idx}
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <button type="submit" className="secondary-btn">
              Check Answer
            </button>
          </form>

          {result === "correct" && (
            <div className="quiz-result quiz-result-correct">
              ✅ Correct – this matches the HP 2026 QA expectation.
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleNext}
                >
                  {currentIndex + 1 === questions.length
                    ? "Finish Quiz"
                    : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {result === "wrong" && (
            <div className="quiz-result quiz-result-wrong">
              ❌ Not quite – review the expectations above and try again.
            </div>
          )}
        </>
      ) : (
        <p className="quiz-finished">
          ✅ You&apos;ve completed all questions for this criterion.
        </p>
      )}
    </div>
  );
}

export default Quiz;
