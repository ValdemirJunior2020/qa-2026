// src/pages/AdminTools.js
import React, { useEffect, useMemo, useState } from "react";
import criteriaData from "../data/criteriaData";
import quizFallback from "../data/quizData";
import expectationsFallback from "../data/expectationsData";
import { supabase } from "../supabaseClient";

export default function AdminTools() {
  const [email, setEmail] = useState(null);
  const adminEmail = (process.env.REACT_APP_ADMIN_EMAIL || "").toLowerCase();
  const isAdmin = !!email && email.toLowerCase() === adminEmail;

  const [criterionId, setCriterionId] = useState(criteriaData?.[0]?.id || "greeting");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Expectation form
  const [title, setTitle] = useState("");
  const [bulletsText, setBulletsText] = useState("");
  const [approvedText, setApprovedText] = useState("");
  const [missesText, setMissesText] = useState("");
  const [examplesText, setExamplesText] = useState("");

  // Quiz JSON editor
  const [quizJsonText, setQuizJsonText] = useState("[]");

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setEmail(data?.session?.user?.email || null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setEmail(sess?.user?.email || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const selectedMeta = useMemo(() => {
    return criteriaData.find((c) => c.id === criterionId);
  }, [criterionId]);

  function toLines(arr) {
    return (Array.isArray(arr) ? arr : []).join("\n");
  }
  function fromLines(text) {
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function loadFromSupabase() {
    setStatus("");
    setLoading(true);
    try {
      // Expectations
      const { data: expRow } = await supabase
        .from("expectations")
        .select("id,title,sections,approved_phrases,common_misses,examples")
        .eq("id", criterionId)
        .maybeSingle();

      const fallbackExp = expectationsFallback?.[criterionId] || null;

      const exp = expRow || fallbackExp || null;

      setTitle(exp?.title || selectedMeta?.title || "");
      const bullets =
        exp?.sections?.bullets ||
        exp?.bullets ||
        fallbackExp?.sections?.bullets ||
        fallbackExp?.bullets ||
        [];
      setBulletsText(toLines(bullets));
      setApprovedText(toLines(exp?.approved_phrases || exp?.approvedPhrases || []));
      setMissesText(toLines(exp?.common_misses || exp?.commonMisses || []));
      setExamplesText(toLines(exp?.examples || []));

      // Quizzes
      const { data: quizRow } = await supabase
        .from("quizzes")
        .select("criterion_id,items")
        .eq("criterion_id", criterionId)
        .maybeSingle();

      const fallbackQuiz = quizFallback?.[criterionId] || [];
      const items = quizRow?.items || fallbackQuiz || [];
      setQuizJsonText(JSON.stringify(items, null, 2));

      setStatus("Loaded ✅");
    } catch (e) {
      setStatus(`Load failed: ${e?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterionId]);

  async function saveExpectation() {
    setStatus("");
    setLoading(true);
    try {
      const payload = {
        id: criterionId,
        title: title || "",
        sections: { bullets: fromLines(bulletsText) },
        approved_phrases: fromLines(approvedText),
        common_misses: fromLines(missesText),
        examples: fromLines(examplesText),
      };

      const { error } = await supabase.from("expectations").upsert(payload, { onConflict: "id" });
      if (error) throw error;

      setStatus("Expectation saved ✅");
    } catch (e) {
      setStatus(`Save expectation failed: ${e?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  async function deleteExpectation() {
    if (!window.confirm(`Delete expectation row for "${criterionId}"?`)) return;
    setStatus("");
    setLoading(true);
    try {
      const { error } = await supabase.from("expectations").delete().eq("id", criterionId);
      if (error) throw error;
      setStatus("Expectation deleted ✅ (fallback still shows)");
      await loadFromSupabase();
    } catch (e) {
      setStatus(`Delete expectation failed: ${e?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  async function saveQuiz() {
    setStatus("");
    setLoading(true);
    try {
      let items;
      try {
        items = JSON.parse(quizJsonText);
      } catch {
        throw new Error("Quiz JSON is invalid. Fix JSON formatting first.");
      }

      if (!Array.isArray(items)) {
        throw new Error("Quiz JSON must be an array of quiz questions.");
      }

      const payload = { criterion_id: criterionId, items };

      const { error } = await supabase.from("quizzes").upsert(payload, { onConflict: "criterion_id" });
      if (error) throw error;

      setStatus("Quiz saved ✅");
    } catch (e) {
      setStatus(`Save quiz failed: ${e?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuiz() {
    if (!window.confirm(`Delete quiz row for "${criterionId}"?`)) return;
    setStatus("");
    setLoading(true);
    try {
      const { error } = await supabase.from("quizzes").delete().eq("criterion_id", criterionId);
      if (error) throw error;
      setStatus("Quiz deleted ✅ (fallback still shows)");
      await loadFromSupabase();
    } catch (e) {
      setStatus(`Delete quiz failed: ${e?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="page">
        <h2>Admin Tools</h2>
        <p className="muted">You must be logged in as the admin to access this page.</p>
        <div className="alert alert-warn">
          Logged in as: <strong>{email || "Not signed in"}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Admin Tools</h2>
          <p className="muted">Manage Expectations + Quizzes stored in Supabase (fallback remains in code).</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Pick Criterion</h3>

          <select
            className="admin-select"
            value={criterionId}
            onChange={(e) => setCriterionId(e.target.value)}
            disabled={loading}
          >
            {criteriaData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.id})
              </option>
            ))}
          </select>

          <div className="admin-status">
            <div>Signed in as: <strong>{email}</strong></div>
            <div style={{ marginTop: 6 }}>{loading ? "Working…" : status || "Ready"}</div>
          </div>

          <div className="admin-actions">
            <button className="nav__btn" type="button" onClick={loadFromSupabase} disabled={loading}>
              Reload from Supabase
            </button>
          </div>
        </div>

        {/* EXPECTATIONS */}
        <div className="admin-card">
          <h3>Expectation Editor</h3>

          <label className="muted">Title</label>
          <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="muted" style={{ marginTop: 10 }}>Bullets (one per line)</label>
          <textarea className="admin-textarea" rows={7} value={bulletsText} onChange={(e) => setBulletsText(e.target.value)} />

          <label className="muted" style={{ marginTop: 10 }}>Approved Phrases (one per line)</label>
          <textarea className="admin-textarea" rows={6} value={approvedText} onChange={(e) => setApprovedText(e.target.value)} />

          <label className="muted" style={{ marginTop: 10 }}>Common Misses (one per line)</label>
          <textarea className="admin-textarea" rows={6} value={missesText} onChange={(e) => setMissesText(e.target.value)} />

          <label className="muted" style={{ marginTop: 10 }}>Examples (one per line)</label>
          <textarea className="admin-textarea" rows={5} value={examplesText} onChange={(e) => setExamplesText(e.target.value)} />

          <div className="admin-actions">
            <button className="nav__btn nav__btn--primary" type="button" onClick={saveExpectation} disabled={loading}>
              Save Expectation
            </button>
            <button className="nav__btn" type="button" onClick={deleteExpectation} disabled={loading}>
              Delete Expectation Row
            </button>
          </div>

          <p className="muted">
            Deleting the row does NOT break the app — it will show the fallback from your code files.
          </p>
        </div>

        {/* QUIZZES */}
        <div className="admin-card">
          <h3>Quiz Editor (JSON)</h3>
          <p className="muted">
            Paste an array of quiz items (same shape as <code>quizData.js</code>).
          </p>

          <textarea
            className="admin-textarea"
            rows={18}
            value={quizJsonText}
            onChange={(e) => setQuizJsonText(e.target.value)}
          />

          <div className="admin-actions">
            <button className="nav__btn nav__btn--primary" type="button" onClick={saveQuiz} disabled={loading}>
              Save Quiz
            </button>
            <button className="nav__btn" type="button" onClick={deleteQuiz} disabled={loading}>
              Delete Quiz Row
            </button>
          </div>

          <p className="muted">
            Tip: Keep <code>correctIndex</code> aligned with the <code>options</code> array (0-based).
          </p>
        </div>
      </div>
    </div>
  );
}
