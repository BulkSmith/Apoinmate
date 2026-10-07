import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { meta } from "@/components/pages/PageKit";
import { FaqSection } from "@/components/home/sections";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () =>
    meta(
      "Help Center & FAQs | Apoinmate",
      "Answers about booking appointments, doctor verification, payments, cancellations and Apoinmate's AI assistant Aira.",
    ),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">
          {t("Help center", "सहायता केंद्र")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t(
            "Common questions about appointments, payments and using Apoinmate. Still stuck? Write to support@apoinmate.com.",
            "अपॉइंटमेंट, भुगतान और Apoinmate के उपयोग से जुड़े आम प्रश्न। फिर भी मदद चाहिए? support@apoinmate.com पर लिखें।",
          )}
        </p>
      </div>
      <FaqSection full />
    </SiteLayout>
  );
}
