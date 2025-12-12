// src/pages/Home.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import useProgress from "../hooks/useProgress";
import CompletionModal from "../components/CompletionModal";

function Home() {
  const { isCompleted, completedCount } = useProgress();
  const total = criteriaData.length;

  const firstIncomplete = useMemo(() => {
    return criteriaData.find((c) => !isCompleted(c.id));
  }, [isCompleted]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // ✅ Show modal one time when user reaches 100%
  useEffect(() => {
    const allDone = total > 0 && completedCount === total;
    const flagKey = "hp2026_completion_modal_shown_v1";

    if (allDone) {
      const alreadyShown = localStorage.getItem(flagKey) === "true";
      if (!alreadyShown) {
        setShowCompleteModal(true);
        localStorage.setItem(flagKey, "true");
      }
    }
  }, [completedCount, total]);

  const handleCloseModal = () => setShowCompleteModal(false);

  return (
    <section className="page">
      <CompletionModal open={showCompleteModal} onClose={handleCloseModal} />

      <div className="page-header">
        <div>
          <h2>HP 2026 Quality Excellence Portal</h2>
          <p className="muted">
            Master the expectations. Complete each criterion quiz to track your progress.
          </p>
        </div>

        {firstIncomplete ? (
          <Link className="primary-btn" to={`/criteria/${firstIncomplete.id}`}>
            Continue Learning →
          </Link>
        ) : (
          <span className="badge badge-complete">✅ All Completed</span>
        )}
      </div>

      <div className="criteria-grid">
        {criteriaData.map((c) => {
          const done = isCompleted(c.id);

          return (
            <Link key={c.id} to={`/criteria/${c.id}`} className="criteria-card">
              <div className="criteria-card-top">
                <h3 className="criteria-title">{c.title}</h3>
                {done ? (
                  <span className="badge badge-complete">✅ Completed</span>
                ) : (
                  <span className="badge badge-pending">⏳ In Progress</span>
                )}
              </div>

              <p className="criteria-points">{c.points} points</p>
              <p className="criteria-desc">{c.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Home;
