import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import serviceAppointmentsImage from "@/assets/service-appointments.png";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export const SERVICES = [
  {
    image: serviceAppointmentsImage,
    title: "Doctor Appointments",
    text: "Book in-clinic appointments with verified doctors near you — pick a slot and get instant confirmation.",
    live: true,
    features: [
      "Verified specialists",
      "Instant confirmation",
      "Transparent fees",
      "Private records",
    ],
  },
] as const;

export function ServicesSection() {
  const { t } = useLang();
  return (
    <Section>
      <SectionHeading
        center={false}
        eyebrow={t("Healthcare services", "स्वास्थ्य सेवाएं")}
        title={t(
          "Everything patients need, added responsibly.",
          "मरीज़ों की हर ज़रूरत, ज़िम्मेदारी के साथ।",
        )}
        description={t(
          "We launch a service only when it can be delivered reliably. Upcoming services are clearly marked as coming soon.",
          "हम कोई सेवा तभी शुरू करते हैं जब उसे भरोसेमंद तरीके से दिया जा सके। आने वाली सेवाएं 'जल्द आ रहा है' के रूप में दिखाई जाती हैं।",
        )}
      />

      <div className="group relative mt-8">
        <div
          className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/15 to-accent/20 opacity-40 blur transition-opacity duration-500 group-hover:opacity-70"
          aria-hidden="true"
        />
        {SERVICES.map(({ image, title, text, live, features }) => (
          <div
            key={title}
            className="glass-card relative flex flex-col items-stretch overflow-hidden rounded-[2.5rem] shadow-xl md:flex-row"
          >
            <div className="relative w-full min-h-[260px] bg-primary-soft/40 md:w-2/5">
              <img
                src={image}
                alt={title}
                loading="lazy"
                width={800}
                height={560}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                className={`absolute left-5 top-5 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${
                  live ? "bg-success text-success-foreground" : "bg-card text-muted-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-success-foreground" : "bg-muted-foreground"}`}
                />
                {live ? t("Available now", "अभी उपलब्ध") : t("Coming soon", "जल्द आ रहा है")}
              </span>
            </div>

            <div className="w-full p-6 sm:p-10 md:w-3/5 md:p-12">
              <h3 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-navy">{f}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="mt-8 h-12 rounded-2xl px-8 text-base">
                <Link to="/find-doctors">
                  {t("Book Appointment Now", "अभी अपॉइंटमेंट बुक करें")}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
