// src/pages/AdminTools.js
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminTools() {
  const navigate = useNavigate();
  const [expectations, setExpectations] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load expectations and quiz questions from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch Expectations
      const { data: expectationsData, error: expectationsError } = await supabase
        .from("expectations")
        .select("*");
      if (expectationsError) {
        console.error("Error loading expectations:", expectationsError.message);
      } else {
        setExpectations(expectationsData);
      }

      // Fetch Quiz Questions
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_questions")
        .select("*");
      if (quizError) {
        console.error("Error loading quiz questions:", quizError.message);
      } else {
        setQuizQuestions(quizData);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Handle deleting an expectation or quiz question
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    setLoading(true);
    let error;
    if (type === "expectation") {
      const { error: deleteError } = await supabase
        .from("expectations")
        .delete()
        .eq("id", id);
      error = deleteError;
    } else if (type === "quiz") {
      const { error: deleteError } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("id", id);
      error = deleteError;
    }

    if (error) {
      alert("Error deleting item: " + error.message);
    } else {
      alert(`${type} deleted successfully!`);
      // Reload data after deletion
      setExpectations(expectations.filter((e) => e.id !== id));
      setQuizQuestions(quizQuestions.filter((q) => q.id !== id));
    }
    setLoading(false);
  };

  // Handle adding or editing expectations/quiz questions
  const handleAddOrEdit = (type, id) => {
    navigate(`/admin-tools/${type}/${id ? id : ""}`);
  };

  return (
    <div className="page">
      <h2>Admin Tools</h2>
      <p className="muted">Manage expectations and quiz questions.</p>

      <div className="admin-section">
        <h3>Manage Expectations</h3>
        {loading && <p>Loading...</p>}
        <button
          className="primary-btn"
          onClick={() => handleAddOrEdit("expectation", "")}
        >
          Add New Expectation
        </button>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expectations.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>
                  <button
                    onClick={() => handleAddOrEdit("expectation", exp.id)}
                    className="secondary-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, "expectation")}
                    className="secondary-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Manage Quiz Questions</h3>
        <button
          className="primary-btn"
          onClick={() => handleAddOrEdit("quiz", "")}
        >
          Add New Quiz Question
        </button>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizQuestions.map((q) => (
              <tr key={q.id}>
                <td>{q.question}</td>
                <td>
                  <button
                    onClick={() => handleAddOrEdit("quiz", q.id)}
                    className="secondary-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id, "quiz")}
                    className="secondary-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
