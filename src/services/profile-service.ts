/** Patient profile data operations. */
import { supabase } from "@/integrations/supabase/client";
import type { PatientProfile } from "@/types/patient";

export async function getProfile(userId: string): Promise<PatientProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as PatientProfile | null) ?? null;
}

export async function updateProfile(userId: string, patch: Partial<PatientProfile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as PatientProfile | null;
}
