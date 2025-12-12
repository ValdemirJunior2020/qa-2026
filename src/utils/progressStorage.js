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
    if (!raw) return { completed: {}, scores: {} };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { completed: {}, scores: {} };

    const completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
    const scores = parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {};

    return { completed, scores };
  } catch {
    return { completed: {}, scores: {} };
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
  saveProgress({ completed: {}, scores: {} });
}

/** ✅ Save a quiz score for a criterion */
export function saveCriterionScore(criterionId, scoreObj) {
  const progress = loadProgress();
  progress.scores[criterionId] = {
    ...scoreObj,
    updatedAt: new Date().toISOString(),
  };
  saveProgress(progress);
  return progress;
}

/** ✅ Read score info for a criterion */
export function getCriterionScore(criterionId) {
  const progress = loadProgress();
  return progress.scores?.[criterionId] || null;
}

/** ✅ Export progress JSON (AdminTools) */
export function exportProgressJson() {
  return JSON.stringify(loadProgress(), null, 2);
}

/** ✅ Import progress JSON (AdminTools) */
export function importProgressJson(jsonString) {
  const parsed = JSON.parse(jsonString);

  if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON");

  const completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
  const scores = parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {};

  saveProgress({ completed, scores });
}

export { PROGRESS_EVENT };
