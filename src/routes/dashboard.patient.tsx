import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Heart,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { MedicalRecords } from "@/components/records/MedicalRecords";
import { meta } from "@/components/pages/PageKit";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { useAuthUser, useProfile } from "@/hooks/useAuthUser";
import { requireRouteAuth } from "@/lib/route-auth";

export const Route = createFileRoute("/dashboard/patient")({
  ssr: false,
  beforeLoad: () => requireRouteAuth("/dashboard/patient"),
  shouldReload: true,
  head: () =>
    meta(
      "Patient Dashboard | Apoinmate",
      "Track upcoming and past appointments, prescriptions, medical records, saved doctors and payments in your Apoinmate patient dashboard.",
    ),
  component: PatientDashboard,
});

function PatientDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const { profile } = useProfile(user?.id ?? null);
  const next = DOCTORS[0]!;
  const cards = [
    { icon: CalendarCheck, label: "Upcoming appointments", value: "1" },
    { icon: ClipboardList, label: "Past appointments", value: "6" },
    { icon: FileText, label: "Prescriptions", value: "4" },
    { icon: CreditCard, label: "Total paid", value: "₹3,180" },
  ];

  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
        search: { mode: "login", redirect: "/dashboard/patient" },
        replace: true,
      });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Checking your session…
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">
          {profile?.full_name ? `${profile.full_name}'s health dashboard` : "Your health dashboard"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Everything about your care in one place — appointments, records and payments.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-2xl font-bold text-navy">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-navy">Next consultation</h2>
            <div className="mt-4 rounded-2xl bg-card/80 p-5">
              <p className="font-semibold text-navy">{next.name}</p>
              <p className="text-sm text-primary">{next.specialty}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {next.clinic}, {next.area}, {next.city}
              </p>
              <p className="mt-1 text-sm font-medium text-success">Today · 5:30 PM</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl bg-card/70">
                  Reschedule
                </Button>
                <Button variant="ghost" className="rounded-xl">
                  Cancel
                </Button>
                <Button asChild className="rounded-xl">
                  <Link to="/doctors/$doctorId" params={{ doctorId: next.id }}>
                    View doctor
                  </Link>
                </Button>
              </div>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-navy">Recent doctors</h2>
            <ul className="mt-3 divide-y divide-border/70">
              {DOCTORS.slice(1, 4).map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block text-sm font-medium text-navy">{d.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {d.specialty} · {d.city}
                    </span>
                  </span>
                  <Button asChild size="sm" variant="outline" className="rounded-xl bg-card/70">
                    <Link to="/book/$doctorId" params={{ doctorId: d.id }}>
                      Book again
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-5">
            <div className="glass-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> Ask Aira
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Not sure which doctor to see? Describe your symptoms and Aira will guide you.
              </p>
              <Button asChild className="mt-4 w-full rounded-xl">
                <Link to="/ai-assistant">Open Aira</Link>
              </Button>
            </div>

            <div className="glass-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
                <Heart className="h-5 w-5 text-primary" aria-hidden="true" /> Saved doctors
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {DOCTORS.slice(4, 7).map((d) => (
                  <li key={d.id}>
                    {d.name} · {d.specialty}
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>

        <div className="mt-6">
          <MedicalRecords />
        </div>
      </div>
    </SiteLayout>
  );
}
