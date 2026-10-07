import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

export function InfoPage({
  heading,
  intro,
  points,
  ctaLabel = "Get started",
  ctaTo = "/contact",
  children,
  headingHi,
  introHi,
  pointsHi,
  ctaLabelHi,
}: {
  heading: string;
  intro: string;
  points?: string[];
  headingHi?: string;
  introHi?: string;
  pointsHi?: string[];
  ctaLabelHi?: string;
  ctaLabel?: string;
  ctaTo?: string;
  children?: React.ReactNode;
}) {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const shownPoints = hi && pointsHi ? pointsHi : points;
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{hi && headingHi ? headingHi : heading}</h1>
        <p className="mt-4 text-muted-foreground">{hi && introHi ? introHi : intro}</p>

        {shownPoints && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {shownPoints.map((p) => (
              <li key={p} className="glass-card flex items-start gap-3 p-4 text-sm text-navy">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        )}

        {children}

        <Button asChild size="lg" className="mt-10 h-12 rounded-2xl px-7">
          <Link to={ctaTo}>{hi && ctaLabelHi ? ctaLabelHi : ctaLabel}</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

export function LegalPage({
  heading,
  updated,
  sections,
  headingHi,
}: {
  heading: string;
  updated: string;
  headingHi?: string;
  sections: { title: string; body: string; titleHi?: string; bodyHi?: string }[];
}) {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{hi && headingHi ? headingHi : heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Last updated", "अंतिम अपडेट")}: {updated}
        </p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-navy">{hi && s.titleHi ? s.titleHi : s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{hi && s.bodyHi ? s.bodyHi : s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

