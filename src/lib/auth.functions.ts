import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAuthenticatedUserId = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(({ context }) => context.userId);

export const hasDoctorApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("doctor_applications")
      .select("user_id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return data !== null;
  });
