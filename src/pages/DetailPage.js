// src/pages/DetailPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import criteriaData from "../data/criteriaData";
import expectationsFallback from "../data/expectationsData";
import { supabase } from "../supabaseClient";

import Quiz from "../components/Quiz";

function normalizeExpectation(rowOrFallback) {
  // We store JSONB in Supabase; keep it consistent
  const row = rowOrFallback || {};
  const sectionsObj = row.sections || {};
  const bullets = Array.isArray(sectionsObj.bullets) ? sectionsObj.bullets : [];

  const approved = Array.isArray(row.approved_phrases) ? row.approved_phrases : [];
  const misses = Array.isArray(row.common_misses) ? row.common_misses : [];
  const examples = Array.isArray(row.examples) ? row.examples : [];

  return {
    id: row.id || "",
    title: row.title || "",
    bullets,
    approved_phrases: approved,
    common_misses: misses,
    examples,
  };
}

function DetailPage() {
  const { id } = useParams();

  const meta = useMemo(() => {
    return criteriaData.find((c) => c.id === id) || null;
  }, [id]);

  const fallback = useMemo(() => {
    return expectationsFallback?.[id] || null;
  }, [id]);

  const [loading, setLoading] = useState(true);
  const [exp, setExp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supaErr } = await supabase
          .from("expectations")
          .select("id,title,sections,approved_phrases,common_misses,examples")
          .eq("id", id)
          .single();

        if (!alive) return;

        if (supaErr) {
          // If row not found or policy blocks, we still show fallback
          setExp(null);
          setError(supaErr.message || "Unable to load expectation from Supabase.");
        } else {
          setExp(data);
        }
      } catch (e) {
        if (!alive) return;
        setExp(null);
        setError(e?.message || "Unexpected error loading expectation.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) load();

    return () => {
      alive = false;
    };
  }, [id]);

  const title = meta?.title || exp?.title || fallback?.title || id;

  // Choose Supabase row if present, else fallback
  const finalExp = useMemo(() => {
    if (exp) return normalizeExpectation(exp);

    if (fallback) {
      // Your fallback file can be either:
      // 1) { title, bullets, approved_phrases, common_misses, examples }
      // 2) { title, sections:{bullets:[...]}, approved_phrases, common_misses, examples }
      const shaped = {
        id,
        title: fallback.title || title,
        sections: fallback.sections || { bullets: fallback.bullets || [] },
        approved_phrases: fallback.approved_phrases || fallback.approvedPhrases || [],
        common_misses: fallback.common_misses || fallback.commonMisses || [],
        examples: fallback.examples || [],
      };
      return normalizeExpectation(shaped);
    }

    return normalizeExpectation({ id, title, sections: { bullets: [] } });
  }, [exp, fallback, id, title]);

  return (
    <div className="page">
      <div className="detail-wrap">
        <Link to="/criteria" className="back-link">
          ← Back to QA Criteria
        </Link>

        <h1 className="detail-title">{title}</h1>

        <p className="detail-subtitle">
          This expectation is powered by Supabase (read-only for agents).
        </p>

        {loading && <p>Loading expectation…</p>}

        {!loading && error && (
          <div className="notice notice-warn">
            ⚠️ Couldn’t load from Supabase. Showing fallback from code.
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
              {error}
            </div>
          </div>
        )}

        {/* ✅ Expectation content */}
        <div className="detail-card">
          <h2 className="detail-section-title">✅ What “Good” Looks Like</h2>

          <h3 className="detail-mini-title">What “Good” looks like</h3>
          <ul>
            {finalExp.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>

          <h3 className="detail-mini-title">Required elements</h3>
          <ul>
            {/* Keep it simple for now: show same bullets, or later you can add a `required` array in DB */}
            {finalExp.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>

          <h2 className="detail-section-title">🟢 Approved Phrases</h2>
          <ul>
            {finalExp.approved_phrases.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>

          <h2 className="detail-section-title">🔴 Common Misses</h2>
          <ul>
            {finalExp.common_misses.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>

          <h2 className="detail-section-title">💡 Examples</h2>
          <ul>
            {finalExp.examples.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </div>

        {/* ✅ QUIZ SECTION (this is what you’re missing) */}
        <div className="detail-card" style={{ marginTop: 18 }}>
          <h2 className="detail-section-title">🧠 Knowledge Check</h2>
          <Quiz criterionId={id} />
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
