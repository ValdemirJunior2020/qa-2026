// src/pages/AuthLanding.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    <div className="auth-landing">
      <div className="auth-landing__card">
        <img
          src="/logo.png"
          alt="HP 2026 Logo"
          className="auth-landing__logo"
        />

        <h1 className="auth-landing__title">HP 2026 Quality Excellence Portal</h1>
        <p className="auth-landing__subtitle">
          Sign in to access your QA Criteria, Training Guide, and Knowledge Checks.
        </p>

        <div className="auth-landing__actions">
          <button
            type="button"
            className="auth-landing__btn auth-landing__btn--primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            type="button"
            className="auth-landing__btn auth-landing__btn--ghost"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>

        <div className="auth-landing__footnote">
          If you don’t have an account, click <strong>Sign up</strong>.
        </div>
      </div>
    </div>
  );
}
