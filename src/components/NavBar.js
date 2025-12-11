// src/components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        HP 2026 Quality Excellence Portal
      </div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/criteria">QA Criteria</Link>
      </nav>
    </header>
  );
}

export default NavBar;
