// src/pages/Resources.js
import React from "react";

function Resources() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Resources</h2>
          <p className="muted">
            Official HP training documents and quick-access tools for 2026 Quality Excellence.
          </p>
        </div>
      </div>

      <div className="resources-grid">
        <div className="resources-card">
          <h3>📘 Training Guide (Dec 2025)</h3>
          <p className="muted">
            Use this guide as the standard for expectations and coaching language.
          </p>

          <div className="resources-actions">
            <a
              className="primary-btn"
              href="/docs/Training Guide Dec 2025 version 2.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </a>

            <a
              className="secondary-btn"
              href="/docs/Training Guide Dec 2025 version 2.pdf"
              download
            >
              Download PDF
            </a>
          </div>

          <p className="resources-note">
            File location: <code>public/docs/Training Guide Dec 2025 version 2.pdf</code>
          </p>
        </div>

        <div className="resources-card">
          <h3>⚡ Quick Links</h3>
          <p className="muted">
            Jump straight to the areas used most often by agents and leaders.
          </p>

          <div className="resources-links">
            <a className="resource-link" href="/criteria">✅ QA Criteria</a>
            <a className="resource-link" href="/manager">📊 Manager Dashboard</a>
            <a className="resource-link" href="/admin-tools">🛠️ Admin Tools</a>
          </div>

          <p className="resources-note">
            Tip: add internal SOP links here later (Zendesk, QA form, refunds policy, etc.).
          </p>
        </div>

        <div className="resources-card">
          <h3>📌 2026 Coaching Standard</h3>
          <p className="muted">
            Coaching should reinforce consistency, empathy, policy accuracy, and professional tone.
          </p>

          <ul className="resources-list">
            <li>Use “Hotel Reservations” branding consistently</li>
            <li>Confirm itinerary, guest name, property, and dates when applicable</li>
            <li>Follow refund / cancellation policy — never promise outcomes</li>
            <li>Group flow: 9+ rooms qualifies; changes require a new request</li>
            <li>Recap next steps clearly and professionally</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Resources;
