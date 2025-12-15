// src/pages/AdminQuiz.js
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import criteriaData from "../data/criteriaData";

function makeId(criterionId) {
  return `${criterionId}-${Date.now()}`;
}

export default function AdminQuiz() {
  const [criterionId, setCriterionId] = useState(criteriaData[0]?.id || "greeting");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("Option A\nOption B\nOption C");
  const [correctIndex, setCorrectIndex] = useState(0);

  const load = async (cid) => {
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase
      .from("quiz_questions")
      .select("id,criterion_id,question,options,correct_index,active,updated_at")
      .eq("criterion_id", cid)
      .order("updated_at", { ascending: false });

    if (error) {
      setStatus(`Error: ${error.message}`);
      setRows([]);
    } else {
      setRows(data || []);
      setStatus("Ready");
    }

    setLoading(false);
  };

  useEffect(() => {
    load(criterionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterionId]);

  const optionsArray = useMemo(() => {
    return optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [optionsText]);

  const addQuestion = async () => {
    setStatus("");

    if (!question.trim()) return setStatus("Please type a question.");
    if (optionsArray.length < 2) return setStatus("Please add at least 2 options.");
    if (correctIndex < 0 || correctIndex >= optionsArray.length) {
      return setStatus("Correct index is out of range.");
    }

    const payload = {
      id: makeId(criterionId),
      criterion_id: criterionId,
      question: question.trim(),
      options: optionsArray,
      correct_index: Number(correctIndex),
      active: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("quiz_questions").insert(payload);

    if (error) return setStatus(`Error: ${error.message}`);

    setQuestion("");
    setOptionsText("Option A\nOption B\nOption C");
    setCorrectIndex(0);
    setStatus("✅ Added.");
    load(criterionId);
  };

  const toggleActive = async (row) => {
    const { error } = await supabase
      .from("quiz_questions")
      .update({ active: !row.active, updated_at: new Date().toISOString() })
      .eq("id", row.id);

    if (error) return setStatus(`Error: ${error.message}`);
    load(criterionId);
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this question?")) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", row.id);
    if (error) return setStatus(`Error: ${error.message}`);
    setStatus("🗑️ Deleted.");
    load(criterionId);
  };

  return (
    <div className="page">
      <h2>Admin — Quiz Builder</h2>
      <p className="muted">Add/edit/delete quiz questions stored in Supabase.</p>

      <div className="admin-card" style={{ marginTop: 12 }}>
        <label className="muted">Criterion</label>
        <select
          className="input"
          value={criterionId}
          onChange={(e) => setCriterionId(e.target.value)}
        >
          {criteriaData.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <div style={{ height: 12 }} />

        <label className="muted">Question</label>
        <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} />

        <div style={{ height: 12 }} />

        <label className="muted">Options (one per line)</label>
        <textarea
          className="admin-textarea"
          rows={5}
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
        />

        <div style={{ height: 12 }} />

        <label className="muted">Correct option index (0-based)</label>
        <input
          className="input"
          type="number"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
          min={0}
        />

        <button className="primary-btn" style={{ marginTop: 12 }} onClick={addQuestion} type="button">
          Add Question
        </button>

        <div className="admin-status" style={{ marginTop: 12 }}>
          {loading ? "Loading…" : status || "Ready"}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Questions</h3>

        {rows.length === 0 ? (
          <p className="muted">No questions yet for this criterion.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {rows.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 800 }}>{r.question}</div>
                <ol style={{ marginTop: 8 }}>
                  {(Array.isArray(r.options) ? r.options : []).map((o, i) => (
                    <li key={i} style={{ fontWeight: i === r.correct_index ? 800 : 400 }}>
                      {o} {i === r.correct_index ? "✅" : ""}
                    </li>
                  ))}
                </ol>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="nav__btn" type="button" onClick={() => toggleActive(r)}>
                    {r.active ? "Disable" : "Enable"}
                  </button>
                  <button className="nav__btn" type="button" onClick={() => remove(r)}>
                    Delete
                  </button>
                </div>

                <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                  id: {r.id} • active: {String(r.active)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
