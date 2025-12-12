// src/pages/AdminTools.js
import React, { useMemo, useState } from "react";
import criteriaData from "../data/criteriaData";
import {
  exportProgressJson,
  importProgressJson,
  resetProgress,
  resetCriterion,
} from "../utils/progressStorage";

function AdminTools() {
  const [status, setStatus] = useState("");
  const [importText, setImportText] = useState("");
  const [selectedCriterion, setSelectedCriterion] = useState(criteriaData[0]?.id || "");

  const total = useMemo(() => criteriaData.length, []);

  const resetCompletionModalFlag = () => {
    localStorage.removeItem("hp2026_completion_modal_shown_v1");
    setStatus("✅ Completion modal flag reset.");
  };

  const handleResetProgress = () => {
    resetProgress();
    setStatus("✅ Progress reset to 0 (all criteria).");
  };

  const handleResetOne = () => {
    if (!selectedCriterion) return;
    resetCriterion(selectedCriterion);
    setStatus(`✅ Reset criterion: ${selectedCriterion}`);
  };

  const handleExport = async () => {
    try {
      const json = exportProgressJson();
      await navigator.clipboard.writeText(json);
      setStatus("✅ Progress JSON copied to clipboard.");
    } catch {
      const json = exportProgressJson();
      setImportText(json);
      setStatus("⚠️ Clipboard blocked. JSON placed in the textbox below.");
    }
  };

  const handleImport = () => {
    try {
      importProgressJson(importText);
      setStatus("✅ Progress imported successfully.");
    } catch (err) {
      setStatus(`❌ Import failed: ${err.message || "Invalid JSON"}`);
    }
  };

  return (
    <section className="page">
      <h2>Admin Tools</h2>
      <p className="muted">
        Internal controls for training operations. Total criteria: {total}.
      </p>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Reset Controls</h3>
          <p className="muted">Use when testing or restarting training.</p>

          <div className="admin-actions">
            <button className="secondary-btn" type="button" onClick={handleResetProgress}>
              Reset All Progress
            </button>

            <button className="secondary-btn" type="button" onClick={resetCompletionModalFlag}>
              Reset Completion Modal Flag
            </button>
          </div>

          <div className="admin-reset-one">
            <label className="muted" htmlFor="criterionSelect">
              Reset one criterion:
            </label>

            <select
              id="criterionSelect"
              className="admin-select"
              value={selectedCriterion}
              onChange={(e) => setSelectedCriterion(e.target.value)}
            >
              {criteriaData.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button className="secondary-btn" type="button" onClick={handleResetOne}>
              Reset This Criterion
            </button>
          </div>
        </div>

        <div className="admin-card">
          <h3>Export / Import Progress</h3>
          <p className="muted">
            Export progress JSON (backup) or import it into this browser.
          </p>

          <div className="admin-actions">
            <button className="secondary-btn" type="button" onClick={handleExport}>
              Export Progress (Copy JSON)
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              Import Progress (Paste JSON)
            </button>
          </div>

          <textarea
            className="admin-textarea"
            placeholder="Paste progress JSON here to import, or export will appear here if clipboard is blocked..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={10}
          />
        </div>
      </div>

      {status && <div className="admin-status">{status}</div>}
    </section>
  );
}

export default AdminTools;
