import { Link } from "@tanstack/react-router";
import { CheckCircle2, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./Section";

export function ProvidersSection() {
  return (
    <Section>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card p-6 sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-navy text-navy-foreground">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-navy sm:text-2xl">For Patients</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Find the right doctor, book a confirmed slot and keep every prescription and report
            safely in one place — for you and your family.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-navy">
            {[
              "Verified doctors with real availability",
              "Confirmed slots instead of long queues",
              "Prescriptions and reports stored privately",
              "Aira for guidance any time of day",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/find-doctors">Find a doctor</Link>
          </Button>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-navy sm:text-2xl">For Doctors</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill your schedule predictably. Manage availability, appointments, patients and earnings
            from one dashboard — and reduce no-shows with automatic reminders.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-navy">
            {[
              "Set working days, hours, breaks and slot duration",
              "Digital patient queue instead of walk-in crowding",
              "Earnings and settlement visibility",
              "Verified profile with reviews and visibility",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-6 rounded-xl bg-card/70">
            <Link to="/for-doctors">Join as a doctor</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
