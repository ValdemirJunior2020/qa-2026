// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = (process.env.REACT_APP_ADMIN_EMAIL || "").toLowerCase();

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Supabase getSession error:", error.message);
      }

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const isAdmin = useMemo(() => {
    const email = (user?.email || "").toLowerCase();
    return !!adminEmail && email === adminEmail;
  }, [user, adminEmail]);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      isAdmin,
      adminEmail,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, user, loading, isAdmin, adminEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
