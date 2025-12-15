// src/pages/AdminTools.js
import React from "react";
import AdminQuiz from "./AdminQuiz";
import AdminProgress from "./AdminProgress";

export default function AdminTools() {
  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Admin Tools</h1>
      <p className="muted">
        Manage quizzes and monitor user progress (stored in Supabase).
      </p>

      <div className="admin-grid" style={{ marginTop: 12 }}>
        <div className="admin-card">
          <AdminQuiz />
        </div>

        <div className="admin-card">
          <AdminProgress />
        </div>
      </div>
    </div>
  );
}
