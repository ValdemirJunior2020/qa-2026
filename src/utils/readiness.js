// src/utils/readiness.js
import criteriaData from "../data/criteriaData";

/**
 * Readiness is "earned points / total points" * 100
 * Earned points = points for criteria where quiz score is PASS.
 *
 * Why PASS and not just "completed"?
 * Because your completion is intended to represent certification/pass.
 * If your app sets completion only on PASS, then both align.
 * If not, PASS is still the most honest readiness signal.
 */

export function getReadinessLevel(percent) {
  if (percent >= 90) return { label: "World-Class Ready", key: "world" };
  if (percent >= 80) return { label: "Strong Readiness", key: "strong" };
  if (percent >= 60) return { label: "Developing", key: "developing" };
  return { label: "Needs Work", key: "needs" };
}

export function calculateReadiness({ getScore }) {
  const totalPoints = criteriaData.reduce((sum, c) => sum + (Number(c.points) || 0), 0);

  const scoredRows = criteriaData.map((c) => {
    const score = getScore(c.id); // expected shape: { passed, percent, correct, totalQuestions, updatedAt }
    const passed = score?.passed === true;

    return {
      ...c,
      score,
      passed,
      earnedPoints: passed ? (Number(c.points) || 0) : 0,
      scorePercent: score?.percent ?? null,
    };
  });

  const earnedPoints = scoredRows.reduce((sum, r) => sum + r.earnedPoints, 0);

  const readinessPercent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  const level = getReadinessLevel(readinessPercent);

  const gaps = scoredRows
    .filter((r) => !r.passed) // includes failed or not taken
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
