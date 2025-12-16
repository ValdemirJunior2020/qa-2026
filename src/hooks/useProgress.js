// src/hooks/useProgress.js
import { useContext, useCallback } from "react";
import { ProgressContext } from "../context/ProgressContext";

export default function useProgress() {
  const ctx = useContext(ProgressContext);

  if (!ctx) {
    throw new Error("useProgress must be used inside <ProgressProvider />");
  }

  // ✅ Stable helpers
  const isCompleted = useCallback(
    (criterionId) => !!ctx.completed?.[criterionId],
    [ctx.completed]
  );

  const getScore = useCallback(
    (criterionId) => ctx.scores?.[criterionId] || null,
    [ctx.scores]
  );

  return {
    ...ctx,
    isCompleted,
    getScore,
  };
}
