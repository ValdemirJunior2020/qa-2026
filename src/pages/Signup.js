// src/pages/Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setOk(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // Depending on your Supabase settings, this may require email confirmation.
      // If confirmation is OFF, you'll have a session and can go straight in.
      const hasSession = !!data?.session;

      if (hasSession) {
        navigate("/criteria", { replace: true });
      } else {
        setOk(true);
        setMsg("Account created. Please check your email to confirm, then login.");
      }
    } catch (err) {
      setMsg(err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ margin: 0 }}>Sign up</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Create your portal account.
        </p>

        {msg && (
          <div className={`alert ${ok ? "alert-ok" : "alert-warn"}`}>{msg}</div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Email</div>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Password</div>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="nav__btn nav__btn--primary" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
