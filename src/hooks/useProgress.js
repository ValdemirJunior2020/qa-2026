// src/hooks/useProgress.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadProgress, PROGRESS_EVENT } from "../utils/progressStorage";

export default function useProgress() {
  const [state, setState] = useState(() => loadProgress());

  const refresh = useCallback(() => {
    setState(loadProgress());
  }, []);

  useEffect(() => {
    refresh();

    const onProgressUpdated = () => refresh();
    const onStorage = (e) => {
      if (e.key && e.key.includes("hp2026_progress")) refresh();
    };

    window.addEventListener(PROGRESS_EVENT, onProgressUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgressUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  // ✅ Make these stable so Hook deps don’t “change every render”
  const completedMap = useMemo(() => state.completed || {}, [state.completed]);
  const scoresMap = useMemo(() => state.scores || {}, [state.scores]);

  const isCompleted = useCallback(
    (criterionId) => !!completedMap[criterionId],
    [completedMap]
  );

  const completedCount = useMemo(
    () => Object.keys(completedMap).filter((k) => completedMap[k]).length,
    [completedMap]
  );

  const getScore = useCallback(
    (criterionId) => scoresMap[criterionId] || null,
    [scoresMap]
  );

  return { completedMap, scoresMap, isCompleted, completedCount, getScore, refresh };
}
