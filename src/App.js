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
import ManagerDashboard from "./pages/ManagerDashboard";
import Resources from "./pages/Resources";

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
          <Route path="/resources" element={<Resources />} />

          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/admin-tools" element={<AdminTools />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
