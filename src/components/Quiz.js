// src/components/Quiz.js
import React, { useMemo, useState } from "react";
import quizData from "../data/quizData";
import { markCriterionComplete, saveCriterionScore } from "../utils/progressStorage";

const PASS_PERCENT = 80;

function Quiz({ criterionId }) {
  const questions = quizData[criterionId] || [];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null); // "correct" | "wrong" | null
  const [finished, setFinished] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  const currentQuestion = questions[currentIndex];

  const currentPercent = useMemo(() => {
    if (attemptedCount === 0) return 0;
    return Math.round((correctCount / attemptedCount) * 100);
  }, [correctCount, attemptedCount]);

  if (!questions.length) {
    return (
      <p className="quiz-empty">
        Quiz questions for this criterion will be added in the next phase of the
        2026 portal.
      </p>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    setAttemptedCount((prev) => prev + 1);
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    setResult(isCorrect ? "correct" : "wrong");
  };

  const handleNext = () => {
    setResult(null);
    setSelectedIndex(null);

    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // ✅ finish: mark complete + store score
    const finalPercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const passed = finalPercent >= PASS_PERCENT;

    saveCriterionScore(criterionId, {
      totalQuestions: total,
      correct: correctCount,
      percent: finalPercent,
      passed,
      passPercent: PASS_PERCENT,
    });

    markCriterionComplete(criterionId);
    setFinished(true);
  };

  return (
    <div className="quiz-box">
      {!finished ? (
        <>
          <p className="quiz-counter">
            Question {currentIndex + 1} of {total}
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
                    disabled={result === "correct"}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="secondary-btn"
              disabled={selectedIndex === null || result === "correct"}
            >
              Check Answer
            </button>
          </form>

          <div className="quiz-scoreline">
            Score so far: <strong>{correctCount}</strong> correct out of{" "}
            <strong>{attemptedCount}</strong> attempted ({currentPercent}%)
          </div>

          {result === "correct" && (
            <div className="quiz-result quiz-result-correct">
              ✅ Correct – this matches the HP 2026 QA expectation.
              <div>
                <button type="button" className="secondary-btn" onClick={handleNext}>
                  {currentIndex + 1 === total ? "Finish Quiz" : "Next Question"}
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
          ✅ You&apos;ve completed this quiz. Your result has been saved for manager reporting.
        </p>
      )}
    </div>
  );
}

export default Quiz;
