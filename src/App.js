// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProgressBar from "./components/ProgressBar";

import Home from "./pages/Home";
import Criteria from "./pages/Criteria";
import DetailPage from "./pages/DetailPage";
import TrainingGuide from "./pages/TrainingGuide";
import AdminTools from "./pages/AdminTools";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthTest from "./pages/AuthTest";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-main">
        <ProgressBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/criteria" element={<Criteria />} />
          <Route path="/criteria/:id" element={<DetailPage />} />
          <Route path="/training-guide" element={<TrainingGuide />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Test */}
          <Route path="/auth-test" element={<AuthTest />} />

          {/* Protected */}
          <Route
            path="/admin-tools"
            element={
              <RequireAuth>
                <AdminTools />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
