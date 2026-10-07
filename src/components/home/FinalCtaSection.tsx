import { Link } from "@tanstack/react-router";
import { BadgeCheck, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./Section";

export function FinalCta() {
  return (
    <Section>
      <div className="gradient-navy relative overflow-hidden rounded-4xl p-8 text-center md:p-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-navy-foreground sm:text-3xl md:text-4xl">
            Your Time Matters. Your Health Matters More.
          </h2>
          <p className="mt-3 text-sm text-navy-foreground/80 sm:text-base">
            Find the right healthcare provider, book your appointment and spend less time waiting.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="h-12 rounded-2xl px-7 text-base">
              <Link to="/find-doctors">Find a Doctor</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-2xl bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/find-doctors">Book an Appointment</Link>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-navy-foreground/70">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" aria-hidden="true" /> Patients, doctors &amp; clinics
            </span>
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Secure payments
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified providers
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
