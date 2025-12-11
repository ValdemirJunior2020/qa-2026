// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProgressBar from "./components/ProgressBar";
import Home from "./pages/Home";
import Criteria from "./pages/Criteria";
import DetailPage from "./pages/DetailPage";

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
        </Routes>
      </main>
    </div>
  );
}

export default App;
