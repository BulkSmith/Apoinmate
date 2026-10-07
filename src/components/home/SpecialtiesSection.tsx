import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { SPECIALTIES } from "@/data/specialties";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export function SpecialtiesSection() {
  const { t } = useLang();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? SPECIALTIES : SPECIALTIES.slice(0, 8);
  return (
    <Section>
      <SectionHeading
        eyebrow={t("Find doctors", "डॉक्टर खोजें")}
        title={t("Browse by specialty", "विशेषज्ञता के अनुसार देखें")}
        description={t(
          "Choose the care you need and see verified doctors with real availability near you.",
          "अपनी ज़रूरत की देखभाल चुनें और अपने पास उपलब्ध सत्यापित डॉक्टर देखें।",
        )}
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((s) => (
          <Link
            key={s.slug}
            to="/doctors/specialty/$specialty"
            params={{ specialty: s.slug }}
            className="glass-card group flex min-w-0 flex-col items-center p-4 text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <img
              src={s.image}
              alt={s.name}
              loading="lazy"
              width={384}
              height={384}
              className="h-16 w-16 rounded-2xl object-contain sm:h-20 sm:w-20"
            />
            <h3 className="mt-3 text-sm font-semibold text-navy group-hover:text-primary sm:text-base">
              {s.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
          </Link>
        ))}
      </div>

      {SPECIALTIES.length > 8 && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="rounded-2xl bg-card/70 px-6"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? t("View less", "कम देखें") : t("View more specialties", "और विशेषज्ञताएं देखें")}
            <ArrowRight
              className={`ml-2 h-4 w-4 transition-transform ${showAll ? "-rotate-90" : "rotate-90"}`}
            />
          </Button>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-bold text-navy sm:text-2xl">
          {t("Top rated doctors near you", "आपके पास टॉप रेटेड डॉक्टर")}
        </h3>
        <Button asChild variant="ghost" className="rounded-xl">
          <Link to="/find-doctors">
            {t("View all", "सभी देखें")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCTORS.filter((d) => d.featured).slice(0, 3).map((d, i) => (
          <DoctorCard key={d.id} doctor={d} index={i} />
        ))}
      </div>
    </Section>
  );
}
