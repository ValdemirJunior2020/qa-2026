// src/context/ProgressContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import criteriaData from "../data/criteriaData";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  // completed is an object like: { empathy: true, greeting: true }
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  // 1) get session + subscribe
  useEffect(() => {
    let alive = true;

    async function boot() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const session = data?.session || null;

      if (!alive) return;
      setUserId(session?.user?.id || null);
      setEmail(session?.user?.email || null);

      setLoading(false);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
      setEmail(session?.user?.email || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // 2) load progress from supabase whenever userId changes
  useEffect(() => {
    let alive = true;

    async function loadProgress() {
      if (!userId) {
        setCompleted({});
        return;
      }

      const { data, error } = await supabase
        .from("user_progress")
        .select("completed")
        .eq("user_id", userId)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        // keep app working even if DB not ready
        setCompleted({});
        return;
      }

      setCompleted(data?.completed || {});
    }

    loadProgress();

    return () => {
      alive = false;
    };
  }, [userId]);

  const isCompleted = (criterionId) => !!completed?.[criterionId];

  const totalCount = criteriaData.length;
  const completedCount = useMemo(() => Object.keys(completed || {}).filter((k) => completed[k]).length, [completed]);

  const markComplete = async (criterionId, value = true) => {
    // Update UI instantly
    setCompleted((prev) => ({ ...(prev || {}), [criterionId]: !!value }));

    // If not logged in, don’t try to save
    if (!userId) return;

    // Save to Supabase
    const nextCompleted = { ...(completed || {}), [criterionId]: !!value };

    // upsert row
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        email: email || null,
        completed: nextCompleted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      // If save fails, we still keep UI updated (you can add toast later)
      console.error("Saving progress failed:", error.message);
    }
  };

  const resetProgress = async () => {
    setCompleted({});
    if (!userId) return;

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        email: email || null,
        completed: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) console.error("Reset progress failed:", error.message);
  };

  const value = {
    loading,
    userId,
    email,
    completed,
    isCompleted,
    markComplete,
    resetProgress,
    totalCount,
    completedCount,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider />");
  return ctx;
}
