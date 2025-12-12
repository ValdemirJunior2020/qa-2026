// src/components/Quiz.js
import React, { useMemo, useState } from "react";
import quizData from "../data/quizData";
import {
  incrementCriterionAttempt,
  markCriterionComplete,
  markCriterionIncomplete,
  saveCriterionScore,
} from "../utils/progressStorage";

const PASS_PERCENT = 80;

function Quiz({ criterionId }) {
  const questions = quizData[criterionId] || [];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null); // "correct" | "wrong" | null

  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null); // {percent, passed, correct, total}

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

  const currentQuestion = questions[currentIndex];

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setResult(null);
    setCorrectCount(0);
    setAttemptedCount(0);
    setFinished(false);
    setFinalScore(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    setAttemptedCount((prev) => prev + 1);
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    setResult(isCorrect ? "correct" : "wrong");
  };

  const finishQuiz = (finalCorrect) => {
    // ✅ attempt count (each full quiz completion = 1 attempt)
    incrementCriterionAttempt(criterionId);

    const percent = total === 0 ? 0 : Math.round((finalCorrect / total) * 100);
    const passed = percent >= PASS_PERCENT;

    const scoreObj = {
      totalQuestions: total,
      correct: finalCorrect,
      percent,
      passed,
      passPercent: PASS_PERCENT,
    };

    saveCriterionScore(criterionId, scoreObj);

    if (passed) {
      markCriterionComplete(criterionId);
    } else {
      markCriterionIncomplete(criterionId);
    }

    setFinalScore({ percent, passed, correct: finalCorrect, total });
    setFinished(true);
  };

  const handleNext = () => {
    const isLast = currentIndex + 1 >= total;

    if (!isLast) {
      setResult(null);
      setSelectedIndex(null);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const lastWasAnswered = result !== null;
    const lastWasCorrect = result === "correct";

    const finalCorrect = lastWasAnswered
      ? correctCount + (lastWasCorrect ? 1 : 0)
      : correctCount;

    finishQuiz(Math.min(finalCorrect, total));
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
        <div className="quiz-finished-block">
          <h4 className="quiz-finished-title">
            {finalScore?.passed ? "✅ PASS" : "❌ FAIL"}
          </h4>

          <p className="muted">
            Score: <strong>{finalScore?.correct}</strong> /{" "}
            <strong>{finalScore?.total}</strong> (
            <strong>{finalScore?.percent}%</strong>) — Passing requires{" "}
            <strong>{PASS_PERCENT}%</strong>.
          </p>

          {finalScore?.passed ? (
            <p className="quiz-finished">
              ✅ Certified for this criterion. Completion has been recorded.
            </p>
          ) : (
            <p className="quiz-finished">
              ❌ Not certified yet. Please retry to reach the passing score.
            </p>
          )}

          <div className="quiz-finished-actions">
            {!finalScore?.passed && (
              <button type="button" className="primary-btn" onClick={resetQuiz}>
                Retry Quiz
              </button>
            )}

            <button
              type="button"
              className="secondary-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
