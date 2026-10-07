import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import airaAvatar from "@/assets/aira-avatar.png";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Section } from "./Section";

export function AiraSection() {
  const { t } = useLang();
  return (
    <Section>
      <div className="relative grid items-center gap-6 overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary to-navy p-6 shadow-xl md:p-10 lg:grid-cols-[1.05fr_1fr]">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {t("Meet Aira", "आइरा से मिलें")}
          </span>
          <h2 className="mt-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
            {t("Your AI-Powered Healthcare Companion", "आपका एआई हेल्थकेयर साथी")}
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 sm:text-base">
            {t(
              "Aira answers your health questions and helps you around Apoinmate — anytime, in plain language.",
              "आइरा आपके स्वास्थ्य सवालों के जवाब देती है और Apoinmate पर आपकी मदद करती है — कभी भी, सरल भाषा में।",
            )}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-2xl px-6 font-semibold"
            >
              <Link to="/ai-assistant">
                <Sparkles className="mr-2 h-4 w-4" /> {t("Chat with Aira", "आइरा से चैट करें")}
              </Link>
            </Button>
            <span className="text-xs text-primary-foreground/70">
              {t(
                "Health & platform questions only · not a medical diagnosis",
                "केवल स्वास्थ्य व प्लेटफ़ॉर्म से जुड़े सवाल · चिकित्सकीय निदान नहीं",
              )}
            </span>
          </div>
        </div>

        <div className="relative min-w-0 rounded-3xl bg-card/95 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <img
              src={airaAvatar}
              alt="Aira"
              loading="lazy"
              width={512}
              height={512}
              className="h-10 w-10 rounded-2xl bg-primary-soft object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-navy">Aira</p>
              <p className="text-xs text-success">{t("Online", "ऑनलाइन")}</p>
            </div>
          </div>
          <div className="mt-3 space-y-2.5 text-sm">
            <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground">
              Chest tightness while walking for 3 days.
            </p>
            <p className="max-w-[92%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-navy">
              That is usually reviewed by a <strong>Cardiologist</strong>. If the pain is severe or
              spreading to your arm or jaw, seek emergency care now.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
