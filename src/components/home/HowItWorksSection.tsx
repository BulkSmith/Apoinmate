import { CalendarCheck, ClipboardList, Search, Stethoscope } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export function HowItWorks() {
  const { t } = useLang();
  const steps = [
    {
      n: "01",
      title: "Find",
      icon: Search,
      text: "Search doctors and healthcare providers by specialty, location and availability.",
      iconClass: "bg-primary text-primary-foreground",
      ring: "bg-primary/10",
      numClass: "text-primary",
    },
    {
      n: "02",
      title: "Choose",
      icon: ClipboardList,
      text: "Compare profiles, experience, fees, ratings and open slots before you decide.",
      iconClass: "bg-accent text-accent-foreground",
      ring: "bg-accent/40",
      numClass: "text-accent-foreground/70",
    },
    {
      n: "03",
      title: "Book",
      icon: CalendarCheck,
      text: "Pick a slot that suits you and confirm the booking in a few taps.",
      iconClass: "bg-warning text-warning-foreground",
      ring: "bg-warning/15",
      numClass: "text-warning-foreground/70",
    },
    {
      n: "04",
      title: "Get Care",
      icon: Stethoscope,
      text: "Arrive at your slot time and consult your doctor without a long wait.",
      iconClass: "bg-success text-success-foreground",
      ring: "bg-success/12",
      numClass: "text-success",
    },
  ];
  return (
    <Section>
      <SectionHeading
        eyebrow={t("How Apoinmate works", "Apoinmate कैसे काम करता है")}
        title={t("Four simple steps to care.", "इलाज तक पहुँचने के चार आसान कदम।")}
      />
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ n, title, icon: Icon, text, iconClass, ring, numClass }) => (
          <li
            key={n}
            className={`glass-card group relative cursor-default overflow-visible p-4 transition-transform duration-200 hover:-translate-y-1 ${ring}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <span className={`text-xs font-semibold ${numClass}`}>{n}</span>
                <h3 className="truncate text-base font-semibold text-navy">{title}</h3>
              </div>
            </div>

            <div
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-60 -translate-x-1/2 translate-y-1 rounded-2xl bg-navy px-4 py-3 text-xs leading-relaxed text-navy-foreground opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {text}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
