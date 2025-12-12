// src/context/ProgressContext.js
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import criteriaData from "../data/criteriaData";
import { supabase } from "../supabaseClient";

export const ProgressContext = createContext(null);

const LS_KEY = "hp2026_progress_v1";

/**
 * Shape:
 * {
 *   completed: { [criterionId]: true },
 *   scores: { [criterionId]: { percent, correct, total, passedAt } }
 * }
 */

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getEmptyState() {
  return { completed: {}, scores: {} };
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(getEmptyState());
  const [sessionEmail, setSessionEmail] = useState(null);

  // Load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (parsed && typeof parsed === "object") {
      setState({
        completed: parsed.completed || {},
        scores: parsed.scores || {},
      });
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  // Track auth email (optional, used for sync later)
  useEffect(() => {
    let alive = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setSessionEmail(data?.session?.user?.email || null);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSessionEmail(sess?.user?.email || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const totalPoints = useMemo(() => {
    return criteriaData.reduce((sum, c) => sum + (c.points || 0), 0);
  }, []);

  const earnedPoints = useMemo(() => {
    return criteriaData.reduce((sum, c) => {
      return state.completed?.[c.id] ? sum + (c.points || 0) : sum;
    }, 0);
  }, [state.completed]);

  const totalCriteria = useMemo(() => criteriaData.length, []);
  const completedCount = useMemo(() => Object.keys(state.completed || {}).length, [state.completed]);

  const percent = useMemo(() => {
    if (!totalPoints) return 0;
    return Math.round((earnedPoints / totalPoints) * 100);
  }, [earnedPoints, totalPoints]);

  const markComplete = useCallback(async (criterionId, scoreObj) => {
    if (!criterionId) return;

    setState((prev) => ({
      completed: { ...(prev.completed || {}), [criterionId]: true },
      scores: { ...(prev.scores || {}), [criterionId]: scoreObj || prev.scores?.[criterionId] },
    }));

    // Optional: later we can sync to Supabase table user_progress (not required for now)
    // Keeping app stable even if Supabase dashboard is glitchy.
    // If you want syncing, say "next" again and we’ll add it.
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setState(getEmptyState());
  }, []);

  const value = useMemo(() => {
    return {
      completed: state.completed || {},
      scores: state.scores || {},
      totalPoints,
      earnedPoints,
      totalCriteria,
      completedCount,
      percent,
      sessionEmail,
      markComplete,
      resetAll,
    };
  }, [
    state.completed,
    state.scores,
    totalPoints,
    earnedPoints,
    totalCriteria,
    completedCount,
    percent,
    sessionEmail,
    markComplete,
    resetAll,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
