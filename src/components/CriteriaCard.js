// src/components/CriteriaCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

function CriteriaCard({ criterion }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/criteria/${criterion.id}`);
  };

  return (
    <div className="criteria-card">
      <h3>{criterion.title}</h3>
      <p className="criteria-points">{criterion.points} points</p>
      <p className="criteria-short">{criterion.shortDescription}</p>
      <button className="secondary-btn" onClick={handleClick}>
        View Details
      </button>
    </div>
  );
}

export default CriteriaCard;
