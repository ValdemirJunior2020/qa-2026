// src/pages/Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }

    // If email confirmations are ON in Supabase, user must confirm via email.
    const needsEmailConfirm = !data?.session;

    setBusy(false);

    if (needsEmailConfirm) {
      setMsg("✅ Account created. Please check your email to confirm, then login.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Create a login to access the portal.</p>

        {msg && <div className="alert alert-ok">{msg}</div>}

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
            placeholder="Min 6 characters"
            minLength={6}
            required
          />

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;
