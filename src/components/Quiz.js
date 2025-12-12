// src/components/Quiz.js
import React, { useState } from "react";
import quizData from "../data/quizData";
import { markCriterionComplete } from "../utils/progressStorage";

function Quiz({ criterionId }) {
  const questions = quizData[criterionId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <p className="quiz-empty">
        Quiz questions for this criterion will be added in the next phase of the
        2026 portal.
      </p>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setResult(isCorrect ? "correct" : "wrong");
  };

  const handleNext = () => {
    setResult(null);
    setSelectedIndex(null);

    // Go to next question OR finish + mark complete
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // ✅ This is the missing piece in your code:
      markCriterionComplete(criterionId);
      setFinished(true);
    }
  };

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
                    disabled={result === "correct"} // optional: lock after correct
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

          {result === "correct" && (
            <div className="quiz-result quiz-result-correct">
              ✅ Correct – this matches the HP 2026 QA expectation.
              <div>
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
          ✅ You&apos;ve completed all questions for this criterion. Great work
          focusing on HP 2026 expectations.
        </p>
      )}
    </div>
  );
}

export default Quiz;
