// src/App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProgressBar from "./components/ProgressBar";

import Home from "./pages/Home";
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
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-root">
      {!isAuthPage && <NavBar />}
      <main className="app-main">
        {!isAuthPage && <ProgressBar />}

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Test */}
          <Route path="/auth-test" element={<AuthTest />} />

          {/* Protected app */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
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
