// src/components/NavBar.js
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(null);
  const [open, setOpen] = useState(false);

  // Load session + listen for auth changes
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

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close mobile menu on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || "";
  const isAdmin =
    !!email && !!adminEmail && email.toLowerCase() === adminEmail.toLowerCase();

  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  const logout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* LEFT: Brand */}
        <button className="nav__brand" type="button" onClick={() => navigate("/")}>
          HP 2026 Quality Excellence Portal
        </button>

        {/* ✅ Spacer pushes ALL menu items to the right */}
        <div className="nav__spacer" />

        {/* RIGHT: Desktop Links */}
        <nav className="nav__desktop" aria-label="Primary">
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

        {/* Hamburger (mobile only) */}
        <button
          className="nav__burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu Backdrop (click outside closes) */}
      {open && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "transparent",
            border: "none",
            zIndex: 49,
          }}
        />
      )}

      {/* MOBILE MENU */}
      <div className={`nav__mobile ${open ? "nav__mobile--open" : ""}`}>
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/criteria" className={linkClass}>
          QA Criteria
        </NavLink>
        <NavLink to="/training-guide" className={linkClass}>
          Training Guide
        </NavLink>

        <div className="nav__divider" />

        {!email ? (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className="nav__btn nav__btn--primary nav__btn--full">
              Sign up
            </NavLink>
          </>
        ) : (
          <>
            <div className="nav__userMobile">Signed in as: {email}</div>

            {isAdmin && (
              <NavLink to="/admin-tools" className={linkClass}>
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
