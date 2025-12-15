// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProgressBar from "./components/ProgressBar";

import Criteria from "./pages/Criteria";
import DetailPage from "./pages/DetailPage";
import TrainingGuide from "./pages/TrainingGuide";
import AdminTools from "./pages/AdminTools";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthLanding from "./pages/AuthLanding";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="app-root">
      <Routes>
        {/* ✅ Public landing (home) */}
        <Route path="/" element={<AuthLanding />} />

        {/* ✅ Public auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected portal layout */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <div className="portal-root">
                <NavBar />
                <main className="app-main">
                  <ProgressBar />
                  <Routes>
                    <Route path="criteria" element={<Criteria />} />
                    <Route path="criteria/:id" element={<DetailPage />} />
                    <Route path="training-guide" element={<TrainingGuide />} />

                    {/* Keep Admin Tools protected too (your NavBar already hides it unless admin) */}
                    <Route path="admin-tools" element={<AdminTools />} />

                    {/* Default after login */}
                    <Route path="*" element={<Navigate to="/criteria" replace />} />
                  </Routes>
                </main>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
