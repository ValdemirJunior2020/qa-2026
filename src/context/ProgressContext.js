// src/context/ProgressContext.js
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import criteriaData from "../data/criteriaData";
import { supabase } from "../supabaseClient";

export const ProgressContext = createContext(null);

const LS_KEY = "hp2026_progress_v1";

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
  const [sessionUserId, setSessionUserId] = useState(null);

  // Load local progress once
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

  // Auth bootstrap + listen
  useEffect(() => {
    let alive = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const user = data?.session?.user;
      setSessionEmail(user?.email || null);
      setSessionUserId(user?.id || null);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      const user = sess?.user;
      setSessionEmail(user?.email || null);
      setSessionUserId(user?.id || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Pull server progress on login (merge with local)
  useEffect(() => {
    let alive = true;

    async function pullServerProgress() {
      if (!sessionUserId) return;

      const { data, error } = await supabase
        .from("user_progress")
        .select("completed,scores")
        .eq("user_id", sessionUserId)
        .maybeSingle();

      if (!alive) return;

      if (!error && data) {
        // Merge: server wins only when it has values; local fills gaps
        setState((prev) => ({
          completed: { ...(prev.completed || {}), ...(data.completed || {}) },
          scores: { ...(prev.scores || {}), ...(data.scores || {}) },
        }));
      }
    }

    pullServerProgress();

    return () => {
      alive = false;
    };
  }, [sessionUserId]);

  // ✅ Push progress to server (safe upsert)
  const pushToServer = useCallback(
    async (nextState) => {
      if (!sessionUserId) return;

      await supabase.from("user_progress").upsert(
        {
          user_id: sessionUserId,
          email: sessionEmail || null,
          completed: nextState.completed || {},
          scores: nextState.scores || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    },
    [sessionUserId, sessionEmail]
  );

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

  // ✅ Mark complete + save score + sync to Supabase
  const markComplete = useCallback(
    async (criterionId, scoreObj) => {
      if (!criterionId) return;

      setState((prev) => {
        const next = {
          completed: { ...(prev.completed || {}), [criterionId]: true },
          scores: { ...(prev.scores || {}), [criterionId]: scoreObj || prev.scores?.[criterionId] },
        };

        // fire-and-forget sync (no UI blocking)
        pushToServer(next);
        return next;
      });
    },
    [pushToServer]
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setState(getEmptyState());
    // optional: we can also wipe server progress later if you want
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
      sessionUserId,
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
    sessionUserId,
    markComplete,
    resetAll,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
