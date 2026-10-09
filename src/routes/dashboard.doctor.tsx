import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { meta } from "@/components/pages/PageKit";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import {
  AppointmentsPanel,
  EarningsPanel,
  SchedulePanel,
  useClinicAppointments,
} from "@/components/dashboard/ClinicPanels";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser, useProfile } from "@/hooks/useAuthUser";
import { signedAvatarUrl } from "@/lib/avatar";
import { useLang } from "@/lib/i18n";
import { requireDoctorRouteAuth } from "@/lib/route-auth";

export const Route = createFileRoute("/dashboard/doctor")({
  ssr: false,
  beforeLoad: () => requireDoctorRouteAuth("/dashboard/doctor"),
  shouldReload: true,
  head: () =>
    meta(
      "Doctor dashboard | Apoinmate",
      "Manage your Apoinmate practice — verification status, appointments, patients, earnings and profile settings in one place.",
    ),
  component: DoctorDashboard,
});

type Application = {
  full_name: string | null;
  specialty: string | null;
  clinic_name: string | null;
  city: string | null;
  consultation_fee: number | null;
  status: string;
  current_step: number;
  documents: unknown;
};

function DoctorDashboard() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const { profile, setProfile } = useProfile(user?.id ?? null);
  const [app, setApp] = useState<Application | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("overview");
  const [avatar, setAvatar] = useState<string | null>(null);
  const clinic = useClinicAppointments(user?.id ?? "");

  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
        search: { mode: "login", redirect: "/dashboard/doctor" },
        replace: true,
      });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("doctor_applications")
      .select("full_name,specialty,clinic_name,city,consultation_fee,status,current_step,documents")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setApp((data as Application | null) ?? null);
        setReady(true);
      });
  }, [user]);

  useEffect(() => {
    void signedAvatarUrl(profile?.avatar_url).then(setAvatar);
  }, [profile?.avatar_url]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("Loading…", "लोड हो रहा है…")}
        </div>
      </SiteLayout>
    );
  }

  const name = app?.full_name || profile?.full_name || user.email || "Doctor";
  const verified = app?.status === "verified";

  const items = [
    { key: "overview", label: t("Overview", "अवलोकन"), icon: LayoutDashboard },
    { key: "appointments", label: t("Appointments", "अपॉइंटमेंट"), icon: CalendarDays },
    { key: "schedule", label: t("Schedule", "शेड्यूल"), icon: Clock },
    { key: "earnings", label: t("Payments", "भुगतान"), icon: IndianRupee },
    { key: "verification", label: t("Verification", "सत्यापन"), icon: BadgeCheck },
  ];

  const stats = [
    { icon: CalendarDays, label: t("Today's appointments", "आज की अपॉइंटमेंट"), value: String(clinic.stats.today) },
    { icon: Users, label: t("Total patients", "कुल मरीज़"), value: String(clinic.stats.patients) },
    { icon: IndianRupee, label: t("Received this month", "इस माह प्राप्त"), value: `₹${clinic.stats.monthPaid}` },
    { icon: Clock, label: t("Pending payments", "बकाया भुगतान"), value: `₹${clinic.stats.pending}` },
  ];

  return (
    <DashboardShell
      items={items}
      active={tab}
      onChange={setTab}
      name={name}
      subtitle={app?.specialty ?? t("Doctor", "डॉक्टर")}
      avatarUrl={avatar}
    >
      {tab === "settings" ? (
        <ProfileSettings
          userId={user.id}
          email={user.email ?? undefined}
          profile={profile}
          onSaved={setProfile}
        />
      ) : tab === "overview" ? (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h1 className="text-2xl font-bold text-navy">
              {t("Your practice at a glance", "आपकी प्रैक्टिस एक नज़र में")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {app?.clinic_name
                ? `${app.clinic_name}${app.city ? `, ${app.city}` : ""}`
                : t("Complete your profile to go live.", "लाइव होने के लिए प्रोफ़ाइल पूरी करें।")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-5">
                <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-2xl font-bold text-navy">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <VerificationCard app={app} ready={ready} />
        </div>
      ) : tab === "verification" ? (
        <VerificationCard app={app} ready={ready} detailed />
      ) : verified && tab === "appointments" ? (
        <AppointmentsPanel data={clinic} />
      ) : verified && tab === "schedule" ? (
        <SchedulePanel userId={user.id} />
      ) : verified && tab === "earnings" ? (
        <EarningsPanel data={clinic} />
      ) : (
        <div className="glass-card p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-primary/60" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy">
            {verified
              ? t("Nothing here yet", "अभी यहाँ कुछ नहीं है")
              : t("Available after verification", "सत्यापन के बाद उपलब्ध")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Appointments, patients and payouts will appear here once patients start booking with you.",
              "जैसे ही मरीज़ आपके साथ बुकिंग शुरू करेंगे, अपॉइंटमेंट, मरीज़ और भुगतान यहाँ दिखेंगे।",
            )}
          </p>
        </div>
      )}
    </DashboardShell>
  );
}

function VerificationCard({
  app,
  ready,
  detailed = false,
}: {
  app: Application | null;
  ready: boolean;
  detailed?: boolean;
}) {
  const { t } = useLang();
  if (!ready) return null;

  const status = app?.status ?? "none";
  const copy: Record<string, { en: string; hi: string }> = {
    none: {
      en: "You haven't started your doctor registration yet.",
      hi: "आपने अभी तक डॉक्टर पंजीकरण शुरू नहीं किया है।",
    },
    draft: {
      en: "Your application is saved as a draft. Finish the remaining steps to submit it.",
      hi: "आपका आवेदन ड्राफ़्ट में सहेजा गया है। शेष चरण पूरे करके इसे जमा करें।",
    },
    submitted: {
      en: "Your application is under review. We usually verify within 48 hours.",
      hi: "आपका आवेदन समीक्षाधीन है। हम आमतौर पर 48 घंटों में सत्यापित कर देते हैं।",
    },
    verified: {
      en: "You're verified and visible to patients on Apoinmate.",
      hi: "आप सत्यापित हैं और Apoinmate पर मरीज़ों को दिख रहे हैं।",
    },
  };
  const c = copy[status] ?? copy["draft"]!;

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <BadgeCheck
          className={`h-6 w-6 ${status === "verified" ? "text-success" : "text-warning"}`}
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold text-navy">{t("Verification", "सत्यापन")}</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase text-navy">
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t(c.en, c.hi)}</p>
      {detailed && (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Documents on file:", "जमा दस्तावेज़:")}{" "}
          {Array.isArray(app?.documents) ? app.documents.length : 0}
        </p>
      )}
      {status !== "verified" && (
        <Button asChild className="mt-4 h-11 rounded-2xl px-6">
          <Link to="/doctor-signup">
            {status === "none"
              ? t("Start registration", "पंजीकरण शुरू करें")
              : t("Continue registration", "पंजीकरण जारी रखें")}
          </Link>
        </Button>
      )}
    </div>
  );
}
