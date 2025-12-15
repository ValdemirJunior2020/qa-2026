// src/components/RequireAuth.js
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let alive = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setHasSession(!!data?.session);
      setChecking(false);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      setChecking(false);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (checking) return <div className="page">Loading…</div>;

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
