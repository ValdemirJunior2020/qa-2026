// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProgressBar from "./components/ProgressBar";

import Dashboard from "./pages/Dashboard";
import Criteria from "./pages/Criteria";
import DetailPage from "./pages/DetailPage";
import TrainingGuide from "./pages/TrainingGuide";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthTest from "./pages/AuthTest";

import AdminTools from "./pages/AdminTools";
import AdminQuiz from "./pages/AdminQuiz";
import AdminProgress from "./pages/AdminProgress";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-main">
        <ProgressBar />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Test */}
          <Route path="/auth-test" element={<AuthTest />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/criteria"
            element={
              <RequireAuth>
                <Criteria />
              </RequireAuth>
            }
          />
          <Route
            path="/criteria/:id"
            element={
              <RequireAuth>
                <DetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/training-guide"
            element={
              <RequireAuth>
                <TrainingGuide />
              </RequireAuth>
            }
          />

          {/* Admin */}
          <Route
            path="/admin-tools"
            element={
              <RequireAuth>
                <AdminTools />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-quiz"
            element={
              <RequireAuth>
                <AdminQuiz />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-progress"
            element={
              <RequireAuth>
                <AdminProgress />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
