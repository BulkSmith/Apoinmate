import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/for-clinics")({
  head: () =>
    meta(
      "For Clinics — Scheduling, Staff & Reports | Apoinmate",
      "Run your clinic on one system: doctors, schedules, appointments, staff, rooms, billing and analytics on utilisation, no-shows and revenue.",
    ),
  component: () => (
    <InfoPage
      heading="For Clinics"
      intro="Apoinmate gives multi-doctor clinics the operating system they are missing — scheduling, patients, staff and reporting in one place, with analytics that show where time and revenue are being lost."
      points={[
        "Add doctors and manage their schedules centrally",
        "Manage appointments, patients and rooms",
        "Staff accounts with role-based access",
        "Daily appointment and revenue tracking",
        "Doctor utilisation and no-show rate reports",
        "New vs repeat patient analytics",
        "Billing and settlement records",
        "Configurable clinic SaaS subscription",
      ]}
      ctaLabel="Talk to our clinic team"
    />
  ),
});
