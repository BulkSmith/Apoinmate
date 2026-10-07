import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { meta } from "@/components/pages/PageKit";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { useAuthUser, useProfile } from "@/hooks/useAuthUser";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/onboarding/patient")({
  ssr: false,
  head: () =>
    meta(
      "Complete your patient profile | Apoinmate",
      "Add your details once so booking appointments, sharing records and getting reminders is fast every time.",
    ),
  component: PatientOnboarding,
});

function PatientOnboarding() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const { profile } = useProfile(user?.id ?? null);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { mode: "signup" } });
  }, [loading, user, navigate]);

  const steps = [
    t("Account created", "खाता बन गया"),
    t("Complete your profile", "अपनी प्रोफ़ाइल पूरी करें"),
    t("Start booking", "बुकिंग शुरू करें"),
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">
          {t("Welcome to Apoinmate", "Apoinmate में आपका स्वागत है")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t(
            "One last step — tell us a little about yourself so doctors and clinics have what they need.",
            "बस एक आख़िरी कदम — अपने बारे में थोड़ी जानकारी दें ताकि डॉक्टर और क्लीनिक को ज़रूरी विवरण मिल सके।",
          )}
        </p>

        <ol className="mt-6 flex flex-wrap gap-3 text-sm">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
                i <= 1 ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {s}
            </li>
          ))}
        </ol>

        {user && (
          <div className="mt-6">
            <ProfileSettings
              userId={user.id}
              email={user.email ?? undefined}
              profile={profile}
              onSaved={() => void navigate({ to: "/dashboard/patient" })}
            />
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
