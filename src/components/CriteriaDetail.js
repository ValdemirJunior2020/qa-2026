// src/components/CriteriaDetail.js
import React from "react";
import Quiz from "./Quiz";

function CriteriaDetail({ criterion }) {
  if (!criterion) {
    return (
      <div>
        <p>Criterion not found.</p>
      </div>
    );
  }

  return (
    <div className="criteria-detail">
      <h2>{criterion.title}</h2>
      <p className="detail-points">{criterion.points} possible points</p>
      <p className="detail-short">{criterion.shortDescription}</p>

      {/* Expectations */}
      <section className="detail-section">
        <h3>What &quot;Good&quot; Looks Like</h3>
        <ul>
          {criterion.expectations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Training guide hooks */}
      {criterion.trainingSections && criterion.trainingSections.length > 0 && (
        <section className="detail-section">
          <h3>Related Training Guide Sections</h3>
          <ul>
            {criterion.trainingSections.map((sec, index) => (
              <li key={index}>{sec}</li>
            ))}
          </ul>
          <p className="detail-note">
            During 2026 we will align this criterion with the latest HP training
            guide content so agents can see the full process, examples, and
            policies behind each expectation.
          </p>
        </section>
      )}

      {/* Video placeholder */}
      <section className="detail-section">
        <h3>Training Video (Coming Soon)</h3>
        <div className="video-placeholder">
          <p>
            This space will host a short training video showing real examples of
            how to meet this criterion on live calls.
          </p>
        </div>
      </section>

      {/* Quiz placeholder */}
      <section className="detail-section">
        <h3>Quick Check</h3>
        <Quiz criterionId={criterion.id} />
      </section>
    </div>
  );
}

export default CriteriaDetail;
