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
    if (!raw) return { completed: {}, scores: {}, attempts: {} };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { completed: {}, scores: {}, attempts: {} };

    const completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
    const scores = parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {};
    const attempts = parsed.attempts && typeof parsed.attempts === "object" ? parsed.attempts : {};

    return { completed, scores, attempts };
  } catch {
    return { completed: {}, scores: {}, attempts: {} };
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

export function markCriterionIncomplete(criterionId) {
  const progress = loadProgress();
  progress.completed[criterionId] = false;
  saveProgress(progress);
  return progress;
}

export function resetProgress() {
  saveProgress({ completed: {}, scores: {}, attempts: {} });
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

/** ✅ Track attempts */
export function incrementCriterionAttempt(criterionId) {
  const progress = loadProgress();
  const current = Number(progress.attempts?.[criterionId] || 0);
  progress.attempts[criterionId] = current + 1;
  saveProgress(progress);
  return progress;
}

export function getCriterionAttempts(criterionId) {
  const progress = loadProgress();
  return Number(progress.attempts?.[criterionId] || 0);
}

/** ✅ Reset ONE criterion (completion + score + attempts) */
export function resetCriterion(criterionId) {
  const progress = loadProgress();

  if (progress.completed && Object.prototype.hasOwnProperty.call(progress.completed, criterionId)) {
    delete progress.completed[criterionId];
  }
  if (progress.scores && Object.prototype.hasOwnProperty.call(progress.scores, criterionId)) {
    delete progress.scores[criterionId];
  }
  if (progress.attempts && Object.prototype.hasOwnProperty.call(progress.attempts, criterionId)) {
    delete progress.attempts[criterionId];
  }

  saveProgress(progress);
  return progress;
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
  const attempts = parsed.attempts && typeof parsed.attempts === "object" ? parsed.attempts : {};

  saveProgress({ completed, scores, attempts });
}

export { PROGRESS_EVENT };
