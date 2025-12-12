// src/utils/progressStorage.js

const STORAGE_KEY = "hp2026_progress_v1";
const PROGRESS_EVENT = "hp2026_progress_updated";

function emitProgressUpdated() {
  try {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    // ignore
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {} };
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") return { completed: {} };
    if (!parsed.completed || typeof parsed.completed !== "object") {
      return { completed: {} };
    }

    return parsed;
  } catch {
    return { completed: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    emitProgressUpdated();
  } catch {
    // ignore
  }
}

export function markCriterionComplete(criterionId) {
  const progress = loadProgress();
  progress.completed[criterionId] = true;
  saveProgress(progress);
  return progress;
}

export function resetProgress() {
  saveProgress({ completed: {} });
}

/** ✅ NEW: Export progress JSON (for AdminTools) */
export function exportProgressJson() {
  return JSON.stringify(loadProgress(), null, 2);
}

/** ✅ NEW: Import progress JSON (for AdminTools) */
export function importProgressJson(jsonString) {
  const parsed = JSON.parse(jsonString);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid JSON");
  }
  if (!parsed.completed || typeof parsed.completed !== "object") {
    throw new Error("Invalid progress format: missing 'completed'");
  }

  saveProgress({ completed: parsed.completed });
}

export { PROGRESS_EVENT };
