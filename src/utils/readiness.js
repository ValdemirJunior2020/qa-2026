// src/utils/readiness.js
import criteriaData from "../data/criteriaData";

/**
 * Readiness = earned points / total points * 100
 * Earned points = points for criteria where score.passed === true
 */

export function getReadinessLevel(percent) {
  if (percent >= 90) return { label: "World-Class Ready", key: "world" };
  if (percent >= 80) return { label: "Strong Readiness", key: "strong" };
  if (percent >= 60) return { label: "Developing", key: "developing" };
  return { label: "Needs Work", key: "needs" };
}

/**
 * ✅ NEW API (recommended):
 * calculateReadiness(scoresMap)
 *
 * scoresMap shape (from ProgressContext):
 * {
 *   greeting: { passed: true, percent: 100, correct: 2, total: 2, passedAt: "..." },
 *   ...
 * }
 */
export function calculateReadiness(scoresMap = {}) {
  // safe getter so it can never crash
  const getScore = (criterionId) => {
    if (!scoresMap || typeof scoresMap !== "object") return null;
    const score = scoresMap[criterionId];
    return score && typeof score === "object" ? score : null;
  };

  const totalPoints = criteriaData.reduce((sum, c) => sum + (Number(c.points) || 0), 0);

  const scoredRows = criteriaData.map((c) => {
    const score = getScore(c.id); // { passed, percent, correct, total, passedAt }
    const passed = score?.passed === true;

    return {
      ...c,
      score,
      passed,
      earnedPoints: passed ? (Number(c.points) || 0) : 0,
      scorePercent: score?.percent ?? null,
    };
  });

  const earnedPoints = scoredRows.reduce((sum, r) => sum + (Number(r.earnedPoints) || 0), 0);

  const readinessPercent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  const level = getReadinessLevel(readinessPercent);

  const gaps = scoredRows
    .filter((r) => !r.passed) // failed or not attempted
    .map((r) => ({
      id: r.id,
      title: r.title,
      points: r.points,
      status: r.score ? "FAILED" : "NOT ATTEMPTED",
      scorePercent: r.score ? r.scorePercent : null,
    }))
    .sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));

  return {
    totalPoints,
    earnedPoints,
    readinessPercent,
    level,
    gaps,
    scoredRows,
  };
}
