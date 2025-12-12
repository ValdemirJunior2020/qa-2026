// src/pages/DetailPage.js
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import criteriaData from "../data/criteriaData";
import expectationsData from "../data/expectationsData";
import Quiz from "../components/Quiz";

function DetailPage() {
  const { id } = useParams();

  const criterion = useMemo(() => criteriaData.find((c) => c.id === id), [id]);
  const expectation = expectationsData[id] || null;

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
        <div className="detail-panel">
          <h3>Expectation</h3>

          {!expectation ? (
            <div className="muted">
              Content coming soon for <strong>{criterion.id}</strong>. Add it in{" "}
              <code>src/data/expectationsData.js</code>.
            </div>
          ) : (
            <>
              {expectation.sections?.map((sec, idx) => (
                <div key={idx} className="expect-section">
                  <h4 className="expect-heading">{sec.heading}</h4>
                  {sec.text && <p className="muted">{sec.text}</p>}
                  {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                    <ul className="expect-list">
                      {sec.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {Array.isArray(expectation.approvedPhrases) && expectation.approvedPhrases.length > 0 && (
                <div className="expect-section">
                  <h4 className="expect-heading">Approved phrases</h4>
                  <ul className="expect-list">
                    {expectation.approvedPhrases.map((p, i) => (
                      <li key={i}>
                        <span className="phrase-pill">“{p}”</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(expectation.commonMisses) && expectation.commonMisses.length > 0 && (
                <div className="expect-section">
                  <h4 className="expect-heading">Common misses</h4>
                  <ul className="expect-list">
                    {expectation.commonMisses.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(expectation.examples) && expectation.examples.length > 0 && (
                <div className="expect-section">
                  <h4 className="expect-heading">Examples</h4>
                  {expectation.examples.map((ex, i) => (
                    <div key={i} className="example-box">
                      <p>
                        <strong>Scenario:</strong> {ex.scenario}
                      </p>
                      <p>
                        <strong>Ideal response:</strong> {ex.ideal}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(expectation.sources) && expectation.sources.length > 0 && (
                <div className="expect-section">
                  <h4 className="expect-heading">Sources</h4>
                  <ul className="expect-list muted">
                    {expectation.sources.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
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
