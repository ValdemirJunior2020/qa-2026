// src/pages/AuthTest.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthTest() {
  const [sessionEmail, setSessionEmail] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("getSession error:", error.message);
        return;
      }
      const email = data?.session?.user?.email || null;
      console.log("SESSION:", data?.session);
      setSessionEmail(email);
    });
  }, []);

  return (
    <section className="page">
      <h2>Auth test</h2>
      <p className="muted">
        If you are logged in, you should see your email below and also in the console.
      </p>
      <div className="dash-card" style={{ marginTop: "1rem" }}>
        <strong>Session email:</strong> {sessionEmail ? sessionEmail : "No active session"}
      </div>
    </section>
  );
}
