// src/pages/Start.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Start() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      // If already logged in, go straight into the portal
      if (data?.session) {
        navigate("/criteria", { replace: true });
        return;
      }

      setChecking(false);
    }

    boot();

    return () => {
      alive = false;
    };
  }, [navigate]);

  if (checking) return <div className="page">Loading…</div>;

  return (
    <div className="page auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <img
          src="/logo.png"
          alt="HP 2026 Logo"
          style={{ width: 84, height: 84, objectFit: "contain", marginBottom: 10 }}
        />

        <h1 style={{ margin: 0 }}>HP 2026 Quality Excellence Portal</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          Sign up or log in to access criteria, expectations, and quizzes.
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <Link to="/login" className="primary-btn" style={{ width: "100%" }}>
            Login
          </Link>

          <Link to="/signup" className="secondary-btn" style={{ width: "100%", justifyContent: "center" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
