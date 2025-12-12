// src/pages/DetailPage.js
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import criteriaData from "../data/criteriaData";
import Quiz from "../components/Quiz";

function DetailPage() {
  const { id } = useParams();

  const criterion = useMemo(() => {
    return criteriaData.find((c) => c.id === id);
  }, [id]);

  if (!criterion) {
    return (
      <section className="page">
        <h2>Criterion Not Found</h2>
        <p className="muted">This criterion does not exist in your data file.</p>
        <Link className="secondary-btn" to="/criteria">
          Back to Criteria
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>{criterion.title}</h2>
          <p className="muted">{criterion.shortDescription}</p>

          {Array.isArray(criterion.tags) && criterion.tags.length > 0 && (
            <div className="tag-row tag-row-detail">
              {criterion.tags.map((t) => (
                <span key={t} className="tag-pill">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link className="secondary-btn" to="/criteria">
          ← Back to Criteria
        </Link>
      </div>

      <div className="detail-content">
        {/* If you already have expectations content here, keep it.
            This is only adding tags + keeping quiz. */}
        <div className="detail-panel">
          <h3>Expectation</h3>
          <p className="muted">
            Add the full expectation text, examples, and call center coaching notes here.
          </p>
        </div>

        <div className="detail-panel">
          <h3>Quiz</h3>
          <Quiz criterionId={criterion.id} />
        </div>
      </div>
    </section>
  );
}

export default DetailPage;
