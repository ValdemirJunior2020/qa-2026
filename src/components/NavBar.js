// src/components/NavBar.js
import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        HP 2026 Quality Excellence Portal
      </div>

      <nav className="navbar-links">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>

        <NavLink to="/criteria" className="nav-link">
          QA Criteria
        </NavLink>

        <NavLink to="/training-guide" className="nav-link">
          Training Guide
        </NavLink>

        <NavLink to="/manager" className="nav-link">
          Manager
        </NavLink>
      </nav>
    </header>
  );
}

export default NavBar;
