import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/for-doctors")({
  head: () =>
    meta(
      "For Doctors — Manage Appointments & Grow Your Practice | Apoinmate",
      "Join Apoinmate to manage availability, appointments, patients and earnings from one dashboard, reduce no-shows and reach patients across your city.",
    ),
  component: () => (
    <InfoPage
      heading="For Doctors"
      intro="Spend less time managing phone calls and walk-in crowds, and more time consulting. Apoinmate gives you a verified profile, a predictable schedule and a dashboard to run your practice."
      points={[
        "Set working days, consultation hours, breaks and slot duration",
        "Block dates when you are unavailable",
        "Set and update your consultation fee",
        "See today's appointments and patient history at a glance",
        "Automatic reminders that reduce no-shows",
        "Earnings, commissions and settlement visibility",
        "Verified badge after qualification review",
        "Free, Professional and Clinic plans available",
      ]}
      ctaLabel="Apply to join Apoinmate"
    />
  ),
});
