// src/hooks/useProgress.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadProgress, PROGRESS_EVENT } from "../utils/progressStorage";

export default function useProgress() {
  const [completedMap, setCompletedMap] = useState(() => loadProgress().completed || {});

  const refresh = useCallback(() => {
    const progress = loadProgress();
    setCompletedMap(progress.completed || {});
  }, []);

  useEffect(() => {
    refresh();

    const onProgressUpdated = () => refresh();
    const onStorage = (e) => {
      // refresh if another tab changes localStorage
      if (e.key && e.key.includes("hp2026_progress")) refresh();
    };

    window.addEventListener(PROGRESS_EVENT, onProgressUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgressUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const isCompleted = useCallback((criterionId) => !!completedMap[criterionId], [completedMap]);

  const completedCount = useMemo(
    () => Object.keys(completedMap).filter((k) => completedMap[k]).length,
    [completedMap]
  );

  return { completedMap, isCompleted, completedCount, refresh };
}
