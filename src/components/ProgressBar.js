// src/components/ProgressBar.js
import React from "react";

function ProgressBar() {
  // Placeholder: later we’ll show real % of criteria completed
  const completedPercent = 0;

  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        Training Progress: {completedPercent}%
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${completedPercent}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
