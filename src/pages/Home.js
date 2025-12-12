// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import ReadinessCard from "../components/ReadinessCard";

function Home() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>HP 2026 Quality Excellence Portal</h2>
          <p className="muted">
            Interactive expectations + quizzes + readiness tracking for global reservation standards.
          </p>
        </div>
      </div>

      <div className="dash-grid">
        <ReadinessCard showGaps={true} maxGaps={4} />

        <div className="dash-card">
          <h3>Quick Start</h3>
          <p className="muted">
            Start with criteria, complete quizzes, and track progress toward 2026 readiness.
          </p>

          <div className="resources-actions">
            <Link className="primary-btn" to="/criteria">
              Go to QA Criteria
            </Link>
            <Link className="secondary-btn" to="/resources">
              Open Resources
            </Link>
          </div>
        </div>

        <div className="dash-card">
          <h3>Leadership View</h3>
          <p className="muted">
            Monitor coaching priorities and export progress snapshots for meetings.
          </p>

          <div className="resources-actions">
            <Link className="secondary-btn" to="/manager">
              Manager Dashboard
            </Link>
            <Link className="secondary-btn" to="/admin-tools">
              Admin Tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
