// src/api/expectationsApi.js
import { supabase } from "../supabaseClient";

export async function fetchExpectations() {
  const { data, error } = await supabase
    .from("expectations")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching expectations:", error.message);
    throw error;
  }

  return data;
}
