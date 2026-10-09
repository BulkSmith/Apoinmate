import { redirect } from "@tanstack/react-router";
import { getAuthenticatedUserId, hasDoctorApplication } from "@/lib/auth.functions";

async function requireAuth(check: () => Promise<unknown>, redirectTo: string) {
  try {
    return await check();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized:")) {
      throw redirect({
        to: "/auth",
        search: { mode: "login", redirect: redirectTo },
      });
    }
    throw error;
  }
}

export async function requireRouteAuth(redirectTo: string) {
  await requireAuth(getAuthenticatedUserId, redirectTo);
}

export async function requireDoctorRouteAuth(redirectTo: string) {
  const hasApplication = await requireAuth(hasDoctorApplication, redirectTo);
  if (!hasApplication) {
    throw redirect({ to: "/doctor-signup" });
  }
}
