// src/pages/Criteria.js
import React from "react";
import CriteriaList from "../components/CriteriaList";

function Criteria() {
  return (
    <section className="page">
      <h2>HP 2026 QA Criteria</h2>
      <p>
        Below are the core Quality Assurance criteria used to evaluate calls in
        2026. Click on any item to see the detailed expectations, related
        training content, and examples.
      </p>
      <CriteriaList />
    </section>
  );
}

export default Criteria;
