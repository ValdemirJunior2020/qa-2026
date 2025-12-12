// src/components/ProgressBar.js
import React from "react";
import useProgress from "../hooks/useProgress";

function ProgressBar() {
  const { percent, completedCount, totalCriteria, resetAll } = useProgress();

  return (
    <div className="progress-wrap">
      <div className="progress-top">
        <div className="progress-label">
          Training Progress: {percent}% ({completedCount}/{totalCriteria} criteria completed)
        </div>

        <button type="button" className="progress-reset" onClick={resetAll}>
          Reset
        </button>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
