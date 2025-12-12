// src/components/ProgressBar.js
import React, { useCallback, useEffect, useState } from "react";
import criteriaData from "../data/criteriaData";
import {
  loadProgress,
  resetProgress,
  PROGRESS_EVENT,
} from "../utils/progressStorage";

function ProgressBar() {
  const [percent, setPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const total = criteriaData.length;

  // ✅ Stabilized function (fixes ESLint warning)
  const refresh = useCallback(() => {
    const progress = loadProgress();
    const doneIds = Object.keys(progress.completed || {}).filter(
      (id) => progress.completed[id]
    );

    const done = doneIds.length;
    setCompletedCount(done);

    const p = total === 0 ? 0 : Math.round((done / total) * 100);
    setPercent(p);
  }, [total]);

  useEffect(() => {
    refresh();

    const onProgressUpdated = () => refresh();
    const onStorage = (e) => {
      if (e.key && e.key.includes("hp2026_progress")) {
        refresh();
      }
    };

    window.addEventListener(PROGRESS_EVENT, onProgressUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgressUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const handleReset = () => {
    resetProgress();
    refresh();
  };

  return (
    <div className="progress-wrapper">
      <div className="progress-row">
        <div className="progress-label">
          Training Progress: {percent}% ({completedCount}/{total} criteria
          completed)
        </div>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
