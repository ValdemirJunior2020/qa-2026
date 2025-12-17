import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

/* ✅ Training Guide Download */
const GUIDE_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1VaNsJlLPtSqCXTvD_YDi1PwdnXzP2SAW";

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
        {/* Brand */}
        <div
          className="nav__brand"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <img
            src="/qa-no-bg-logo.png"
            alt="HotelPlanner QA"
            className="nav__logo"
          />
          <span className="nav__title">
            HP 2026 Quality Excellence Portal
          </span>
        </div>

        <div className="nav__spacer" />

        {/* ================= DESKTOP NAV ================= */}
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

          {/* ✅ Download Guide */}
          <a
            href={GUIDE_DOWNLOAD_URL}
            className="nav__link"
            target="_blank"
            rel="noreferrer"
            title="Download Training Guide PDF"
          >
            Download Guide
          </a>

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

              <button
                type="button"
                className="nav__btn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* ================= MOBILE BURGER ================= */}
        <button
          className="nav__burger"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
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

        {/* ✅ Download Guide (mobile) */}
        <a
          href={GUIDE_DOWNLOAD_URL}
          className={linkClass({ isActive: false })}
          onClick={close}
          target="_blank"
          rel="noreferrer"
          title="Download Training Guide PDF"
        >
          Download Guide
        </a>

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
            <div className="nav__userMobile">
              Signed in as: {email}
            </div>

            {isAdmin && (
              <NavLink
                to="/admin-tools"
                className={linkClass}
                onClick={close}
              >
                Admin Tools
              </NavLink>
            )}

            <button
              type="button"
              className="nav__btn nav__btn--full"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
