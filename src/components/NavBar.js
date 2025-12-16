// src/components/NavBar.js
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function NavBar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setEmail(data?.session?.user?.email || null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || "";
  const isAdmin =
    !!email && !!adminEmail && email.toLowerCase() === adminEmail.toLowerCase();

  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  const close = () => setOpen(false);

  const logout = async () => {
    await supabase.auth.signOut();
    close();
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* LEFT: Brand */}
        <button className="nav__brand" onClick={() => navigate("/")} type="button">
          <img src="/qa-no-bg-logo.png" alt="QA Portal" className="nav__logo" />
          <span className="nav__title">HP 2026 Quality Excellence Portal</span>
        </button>

        <div className="nav__spacer" />

        {/* RIGHT: Desktop Links */}
        <nav className="nav__desktop">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/criteria" className={linkClass}>
            QA Criteria
          </NavLink>
          <NavLink to="/training-guide" className={linkClass}>
            Training Guide
          </NavLink>

          {!email ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className="nav__btn nav__btn--primary">
                Sign up
              </NavLink>
            </>
          ) : (
            <>
              <span className="nav__user" title={email}>
                {email}
              </span>

              {isAdmin && (
                <NavLink to="/admin-tools" className={linkClass}>
                  Admin Tools
                </NavLink>
              )}

              <button className="nav__btn" onClick={logout} type="button">
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav__burger"
          type="button"
          aria-label="Menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav__mobile ${open ? "nav__mobile--open" : ""}`}>
        <NavLink to="/" className={linkClass} onClick={close}>
          Home
        </NavLink>
        <NavLink to="/criteria" className={linkClass} onClick={close}>
          QA Criteria
        </NavLink>
        <NavLink to="/training-guide" className={linkClass} onClick={close}>
          Training Guide
        </NavLink>

        <div className="nav__divider" />

        {!email ? (
          <>
            <NavLink to="/login" className={linkClass} onClick={close}>
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="nav__btn nav__btn--primary nav__btn--full"
              onClick={close}
            >
              Sign up
            </NavLink>
          </>
        ) : (
          <>
            <div className="nav__userMobile">Signed in as: {email}</div>

            {isAdmin && (
              <NavLink to="/admin-tools" className={linkClass} onClick={close}>
                Admin Tools
              </NavLink>
            )}

            <button className="nav__btn nav__btn--full" onClick={logout} type="button">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
