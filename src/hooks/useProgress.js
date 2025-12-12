// src/hooks/useProgress.js
import { useContext } from "react";
import { ProgressContext } from "../context/ProgressContext";

export default function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider />");
  return ctx;
}
