// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "ok"|"warn", text: string }

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!email.trim() || !password) {
      setMsg({ type: "warn", text: "Please enter your email and password." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMsg({ type: "warn", text: error.message });
        return;
      }

      // Success
      setMsg({ type: "ok", text: "✅ Logged in successfully." });
      navigate("/criteria"); // or "/" if you prefer
    } catch (err) {
      setMsg({ type: "warn", text: err?.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1 style={{ margin: 0 }}>Login</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Sign in to access the HP 2026 Quality Excellence Portal.
        </p>

        {msg && (
          <div className={`alert ${msg.type === "ok" ? "alert-ok" : "alert-warn"}`}>
            {msg.text}
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <div className="muted" style={{ marginBottom: 6 }}>
              Email
            </div>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>
              Password
            </div>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: "100%", marginTop: 10 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 12 }}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
