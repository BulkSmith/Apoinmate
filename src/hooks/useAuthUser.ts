import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getProfile } from "@/services/profile-service";
import type { PatientProfile } from "@/types/patient";

export type { PatientProfile };

/** Current Supabase user, kept in sync with auth state changes. */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

/** Current user's patient profile row. */
export function useProfile(userId: string | null | undefined) {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    void getProfile(userId)
      .catch(() => null)
      .then((data) => {
        if (!active) return;
        setProfile(data ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return { profile, loading, setProfile };
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return { en: "Good morning", hi: "सुप्रभात" };
  if (h < 17) return { en: "Good afternoon", hi: "नमस्कार" };
  return { en: "Good evening", hi: "शुभ संध्या" };
}

export function initialsOf(name: string | null | undefined, fallback = "A") {
  const n = (name ?? "").trim();
  if (!n) return fallback;
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
