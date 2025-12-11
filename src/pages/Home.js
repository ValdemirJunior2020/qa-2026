// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="page home-page">
      <h1>Welcome to the HP 2026 Quality Excellence Portal</h1>
      <p>
        This portal is designed to help call center agents understand and master
        the Quality Assurance expectations used to evaluate calls in 2026.
        You’ll learn what &quot;good&quot; looks like for each criterion and how
        to deliver world-class service on every interaction.
      </p>
      <button className="primary-btn" onClick={() => navigate("/criteria")}>
        Start Learning the QA Criteria
      </button>
    </section>
  );
}

export default Home;
