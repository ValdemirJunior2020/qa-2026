import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function check() {
      setLoading(true);

      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id;

      if (!uid) {
        if (alive) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!alive) return;

      setIsAdmin(!error && !!data?.user_id);
      setLoading(false);
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { isAdmin, loading };
}
