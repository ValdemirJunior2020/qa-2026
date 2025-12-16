// src/hooks/useProgress.js
import { useContext } from "react";
import { ProgressContext } from "../context/ProgressContext";

// ✅ Default export (works with: import useProgress from "...")
// ✅ Named export (works with: import { useProgress } from "...")
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside <ProgressProvider />");
  }
  return ctx;
}

export default useProgress;
