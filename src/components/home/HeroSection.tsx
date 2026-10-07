import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Lock, ShieldCheck, Wallet } from "lucide-react";
import heroClinic from "@/assets/hero-clinic-v2.png.asset.json";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";

export function Hero() {
  const { t } = useLang();
  return (
    <section className="relative isolate w-full overflow-hidden">
      <img
        src={heroClinic.url}
        alt="Doctor standing in a modern hospital reception"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/75 to-background/15"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold leading-[1.12] text-navy sm:text-4xl lg:text-[3.2rem]">
            {t("Making Healthcare Easier, Faster & Accessible with ", "स्वास्थ्य सेवा को आसान, तेज़ और सुलभ बनाते हुए ")}
            <span className="text-gradient">
              {t("Smart Appointment Bookings.", "स्मार्ट अपॉइंटमेंट बुकिंग के साथ।")}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold text-navy/80 sm:text-lg">
            {t(
              "Find trusted doctors, book appointments and skip the long queues — one simple platform for your family's healthcare.",
              "भरोसेमंद डॉक्टर खोजें, अपॉइंटमेंट बुक करें और लंबी कतारों से बचें — आपके परिवार की स्वास्थ्य सेवा के लिए एक सरल मंच।",
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-2xl px-6 text-base">
              <Link to="/find-doctors">
                {t("Book an Appointment", "अपॉइंटमेंट बुक करें")}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-2xl bg-card/70 px-6 text-base"
            >
              <Link to="/about">{t("Learn more", "और जानें")}</Link>
            </Button>
          </div>

          <div className="mt-6">
            <SearchBar />
          </div>

          <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-medium text-navy/70">
            {[
              t("Search", "खोजें"),
              t("Choose", "चुनें"),
              t("Book", "बुक करें"),
              t("Get Care", "इलाज पाएं"),
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="glass rounded-full px-3 py-1.5">{step}</span>
                {i < 3 && <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />}
              </li>
            ))}
          </ol>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              { icon: BadgeCheck, label: t("Verified doctors", "सत्यापित डॉक्टर") },
              { icon: Lock, label: t("Secure payments", "सुरक्षित भुगतान") },
              { icon: ShieldCheck, label: t("Private records", "निजी रिकॉर्ड") },
              { icon: Wallet, label: t("Transparent fees", "पारदर्शी शुल्क") },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-navy">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: BadgeCheck, title: "Verified doctors", text: "Qualifications reviewed before listing" },
    { icon: Lock, title: "Secure payments", text: "Gateway-based, no card data stored" },
    { icon: ShieldCheck, title: "Private records", text: "Medical data access is role-controlled" },
    { icon: Wallet, title: "Transparent fees", text: "Consultation and platform fees shown upfront" },
  ];
  return (
    <Section className="py-4 md:py-6">
      <div className="glass-card grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
