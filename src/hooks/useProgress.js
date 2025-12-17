// src/hooks/useProgress.js
import { useProgressContext } from "../context/ProgressContext";

export default function useProgress() {
  const {
    loading,
    completed,
    isCompleted,
    markComplete,
    resetProgress,
    totalCount,
    completedCount,
  } = useProgressContext();

  return {
    loading,
    completed,
    isCompleted,
    markComplete,
    resetProgress,
    totalCount,
    completedCount,
  };
}
