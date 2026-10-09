import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import heroClinic from "@/assets/hero-illustration.png";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { SPECIALTIES } from "@/data/specialties";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";

export function Hero() {
  const { t } = useLang();

  const trustPills = [
    { icon: BadgeCheck, label: t("Verified doctors", "सत्यापित डॉक्टर") },
    { icon: Lock, label: t("Secure payments", "सुरक्षित भुगतान") },
    { icon: ShieldCheck, label: t("Private records", "निजी रिकॉर्ड") },
    { icon: Wallet, label: t("Transparent fees", "पारदर्शी शुल्क") },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(166,196,255,0.35),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(38,103,245,0.12),transparent_32%),linear-gradient(180deg,#f4f8ff_0%,#edf5ff_100%)]">
      <div
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t("Trusted by families across Bihar", "बिहार भर में परिवारों द्वारा भरोसेमंद")}
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[0.96] tracking-[-0.06em] text-navy sm:text-5xl lg:text-[4.1rem]">
              {t("Making healthcare", "स्वास्थ्य सेवा को")}{" "}
              <span className="text-gradient block sm:inline">
                {t("easier, faster & smarter.", "आसान, तेज़ और स्मार्ट बनाते हैं।")}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-medium text-navy/75 sm:text-lg lg:text-[1.1rem]">
              {t(
                "Find trusted doctors, book appointments and skip the long queues — one simple platform for your family's healthcare.",
                "भरोसेमंद डॉक्टर खोजें, अपॉइंटमेंट बुक करें और लंबी कतारों से बचें — आपके परिवार की स्वास्थ्य सेवा के लिए एक सरल मंच।",
              )}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-2xl px-6 text-base shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition-transform hover:-translate-y-0.5"
              >
                <Link to="/find-doctors">
                  {t("Book an appointment", "अपॉइंटमेंट बुक करें")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-white/80 bg-white/65 px-6 text-base text-navy shadow-sm backdrop-blur-sm hover:bg-white"
              >
                <Link to="/about">{t("Learn more", "और जानें")}</Link>
              </Button>
            </div>

            <div className="mt-6 max-w-2xl">
              <SearchBar className="shadow-[0_16px_40px_rgba(15,23,42,0.08)]" />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/60">
                {t("Popular specialties", "लोकप्रिय विशेषज्ञताएं")}
              </p>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.slice(0, 4).map((specialty) => (
                  <Link
                    key={specialty.slug}
                    to="/doctors/specialty/$specialty"
                    params={{ specialty: specialty.slug }}
                    className="rounded-full border border-primary/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-primary/30 hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(specialty.name, specialty.nameHi)}
                  </Link>
                ))}
              </div>
            </div>

            <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-navy/70">
              {[
                t("Search", "खोजें"),
                t("Choose", "चुनें"),
                t("Book", "बुक करें"),
                t("Get care", "इलाज पाएं"),
              ].map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-border bg-white/70 px-3 py-1.5 shadow-sm">
                    {step}
                  </span>
                  {i < 3 && <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />}
                </li>
              ))}
            </ol>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustPills.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/65 px-3 py-2.5 shadow-sm backdrop-blur-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-navy">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end lg:pt-1">
            <div
              className="absolute right-2 top-10 hidden h-20 w-20 rounded-full border border-primary/20 bg-white/40 blur-sm lg:block"
              aria-hidden="true"
            />
            <div className="relative w-full max-w-[700px] rounded-[2rem] border border-white/80 bg-white/35 p-3 shadow-[0_25px_80px_rgba(18,60,140,0.15)] backdrop-blur-md">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-gradient-to-b from-sky-50 via-white to-sky-50">
                <img
                  src={heroClinic}
                  alt="Doctor beside an appointment calendar and verified profile on a healthcare booking app"
                  className="block h-auto w-full object-contain"
                  width={1200}
                  height={1008}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm ring-1 ring-primary/10 backdrop-blur-sm">
                  <BadgeCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  {t("Verified doctor profiles", "सत्यापित डॉक्टर प्रोफ़ाइल")}
                </div>
                <div className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/10 backdrop-blur-sm">
                  <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("Choose an appointment slot", "अपॉइंटमेंट स्लॉट चुनें")}
                </div>
              </div>
            </div>
          </div>
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
    {
      icon: Wallet,
      title: "Transparent fees",
      text: "Consultation and platform fees shown upfront",
    },
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
