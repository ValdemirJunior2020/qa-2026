// src/pages/Login.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }

    setBusy(false);
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="muted">Use your portal email and password.</p>

        {msg && <div className="alert alert-warn">⚠️ {msg}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="muted">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <label className="muted">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
