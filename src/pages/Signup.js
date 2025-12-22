import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = String(email || "").trim();

    if (!cleanEmail) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

      if (error) throw error;

      // If email confirmations are ON in Supabase, user may need to confirm email
      // We'll navigate them to login with a helpful message.
      navigate("/login", {
        state: {
          notice:
            data?.user && !data?.session
              ? "Account created. Please check your email to confirm your account, then log in."
              : "Account created. You can log in now.",
        },
      });
    } catch (err) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ marginTop: 0 }}>Sign up</h1>
        <p className="muted">Create your portal account.</p>

        {error ? (
          <div
            style={{
              margin: "10px 0 12px",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : null}

        {/* ✅ IMPORTANT: Button must be INSIDE the form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </label>

          {/* ✅ Visible submit button */}
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: "fit-content" }}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="muted" style={{ marginTop: 6 }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
