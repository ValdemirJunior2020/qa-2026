// src/pages/DetailPage.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import CriteriaDetail from "../components/CriteriaDetail";

function DetailPage() {
  const { id } = useParams();
  const criterion = criteriaData.find((item) => item.id === id);

  return (
    <section className="page">
      <Link to="/criteria" className="back-link">
        ← Back to all QA Criteria
      </Link>
      <CriteriaDetail criterion={criterion} />
    </section>
  );
}

export default DetailPage;
