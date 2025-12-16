// src/context/ProgressContext.js
import React, { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import criteriaData from "../data/criteriaData";

export const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  // completed shape: { [criteriaId]: true }
  const [completed, setCompleted] = useState({});

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // ✅ Keep session/user synced
  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const session = data?.session;
      setEmail(session?.user?.email || null);
      setUserId(session?.user?.id || null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || null);
      setUserId(session?.user?.id || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Load progress from Supabase when user changes
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setStatus("");

      if (!userId) {
        setCompleted({});
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select("completed")
          .eq("user_id", userId)
          .maybeSingle();

        if (!alive) return;

        if (error) {
          setStatus(error.message);
          setCompleted({});
        } else {
          setCompleted(data?.completed || {});
        }
      } catch (e) {
        if (!alive) return;
        setStatus(e?.message || "Failed to load progress.");
        setCompleted({});
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [userId]);

  // ✅ Always a FUNCTION
  const isCompleted = useCallback(
    (criteriaId) => {
      return !!completed?.[criteriaId];
    },
    [completed]
  );

  // ✅ Mark complete / uncomplete
  const setCompletedFor = useCallback(
    async (criteriaId, value) => {
      if (!userId) return;

      const next = { ...(completed || {}) };
      if (value) next[criteriaId] = true;
      else delete next[criteriaId];

      setCompleted(next);

      // Upsert to Supabase
      const payload = {
        user_id: userId,
        email: email || null,
        completed: next,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("user_progress").upsert(payload, {
        onConflict: "user_id",
      });

      if (error) {
        // rollback if needed
        setStatus(error.message);
      } else {
        setStatus("");
      }
    },
    [userId, email, completed]
  );

  const toggleCompleted = useCallback(
    async (criteriaId) => {
      const current = !!completed?.[criteriaId];
      await setCompletedFor(criteriaId, !current);
    },
    [completed, setCompletedFor]
  );

  const resetProgress = useCallback(async () => {
    if (!userId) return;
    setCompleted({});

    const payload = {
      user_id: userId,
      email: email || null,
      completed: {},
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("user_progress").upsert(payload, {
      onConflict: "user_id",
    });

    if (error) setStatus(error.message);
    else setStatus("");
  }, [userId, email]);

  const totalCount = criteriaData.length;

  const completedCount = useMemo(() => {
    return Object.keys(completed || {}).length;
  }, [completed]);

  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const value = useMemo(
    () => ({
      loading,
      status,
      email,
      userId,
      completed,
      totalCount,
      completedCount,
      percent,

      // ✅ API expected by DetailPage
      isCompleted,
      setCompletedFor,
      toggleCompleted,
      resetProgress,
    }),
    [
      loading,
      status,
      email,
      userId,
      completed,
      totalCount,
      completedCount,
      percent,
      isCompleted,
      setCompletedFor,
      toggleCompleted,
      resetProgress,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
