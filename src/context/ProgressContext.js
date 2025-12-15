// src/context/ProgressContext.js
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import criteriaData from "../data/criteriaData";
import { supabase } from "../supabaseClient";

export const ProgressContext = createContext(null);

const LS_KEY = "hp2026_progress_v2";

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
  const [session, setSession] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);

  // Load localStorage once
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

  // Track auth session
  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setSession(data?.session || null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const userId = session?.user?.id || null;
  const sessionEmail = session?.user?.email || null;

  // ✅ Pull remote progress after login (one-time)
  useEffect(() => {
    let alive = true;
    if (!userId) return;

    (async () => {
      setLoadingRemote(true);
      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select("completed,scores")
          .eq("user_id", userId)
          .single();

        // If no row yet, that's OK
        if (!alive) return;

        if (!error && data) {
          setState((prev) => {
            // Merge: remote wins (source of truth once logged in)
            return {
              completed: data.completed || prev.completed || {},
              scores: data.scores || prev.scores || {},
            };
          });
        }
      } finally {
        if (alive) setLoadingRemote(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [userId]);

  // ✅ Upsert remote progress whenever state changes (debounced-ish)
  useEffect(() => {
    let cancelled = false;
    if (!userId) return;

    const t = setTimeout(async () => {
      if (cancelled) return;

      // Upsert user progress
      await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          completed: state.completed || {},
          scores: state.scores || {},
        },
        { onConflict: "user_id" }
      );
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [userId, state.completed, state.scores]);

  const totalPoints = useMemo(() => {
    return criteriaData.reduce((sum, c) => sum + (Number(c.points) || 0), 0);
  }, []);

  const earnedPoints = useMemo(() => {
    return criteriaData.reduce((sum, c) => {
      return state.completed?.[c.id] ? sum + (Number(c.points) || 0) : sum;
    }, 0);
  }, [state.completed]);

  const totalCriteria = useMemo(() => criteriaData.length, []);
  const completedCount = useMemo(() => Object.keys(state.completed || {}).length, [state.completed]);

  const percent = useMemo(() => {
    if (!totalPoints) return 0;
    return Math.round((earnedPoints / totalPoints) * 100);
  }, [earnedPoints, totalPoints]);

  const getScore = useCallback(
    (criterionId) => {
      return (state.scores || {})[criterionId] || null;
    },
    [state.scores]
  );

  const isCompleted = useCallback(
    (criterionId) => {
      return !!(state.completed || {})[criterionId];
    },
    [state.completed]
  );

  const markComplete = useCallback(async (criterionId, scoreObj) => {
    if (!criterionId) return;

    setState((prev) => ({
      completed: { ...(prev.completed || {}), [criterionId]: true },
      scores: { ...(prev.scores || {}), [criterionId]: scoreObj || prev.scores?.[criterionId] },
    }));
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
      userId,
      loadingRemote,
      markComplete,
      resetAll,
      getScore,
      isCompleted,
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
    userId,
    loadingRemote,
    markComplete,
    resetAll,
    getScore,
    isCompleted,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
