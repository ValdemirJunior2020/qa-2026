// src/components/CriteriaList.js
import React from "react";
import criteriaData from "../data/criteriaData";
import CriteriaCard from "./CriteriaCard";

function CriteriaList() {
  return (
    <div className="criteria-grid">
      {criteriaData.map((criterion) => (
        <CriteriaCard key={criterion.id} criterion={criterion} />
      ))}
    </div>
  );
}

export default CriteriaList;
