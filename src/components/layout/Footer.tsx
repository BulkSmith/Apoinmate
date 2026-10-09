import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../../../.lovable/logo/apoinmate logo.png";
import { SITE } from "@/config/site";
import { useLang } from "@/lib/i18n";

const COLUMNS_HI: Record<string, string> = {
  Platform: "प्लेटफ़ॉर्म",
  "For Providers": "प्रदाताओं के लिए",
  Company: "कंपनी",
  Support: "सहायता",
  "Find Doctors": "डॉक्टर खोजें",
  Appointments: "अपॉइंटमेंट",
  "AI Health Assistant": "एआई हेल्थ असिस्टेंट",
  "Healthcare Services": "स्वास्थ्य सेवाएं",
  "For Doctors": "डॉक्टरों के लिए",
  "For Clinics": "क्लीनिक के लिए",
  "Partner With Us": "हमारे साथ जुड़ें",
  About: "हमारे बारे में",
  Contact: "संपर्क",
  "Help Center": "सहायता केंद्र",
  FAQs: "सामान्य प्रश्न",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम व शर्तें",
  "Cancellation & Refund Policy": "रद्दीकरण व रिफंड नीति",
};

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { to: "/find-doctors", label: "Find Doctors" },
      { to: "/find-doctors", label: "Appointments" },
      { to: "/ai-assistant", label: "AI Health Assistant" },
      { to: "/services", label: "Healthcare Services" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { to: "/for-doctors", label: "For Doctors" },
      { to: "/for-clinics", label: "For Clinics" },
      { to: "/contact", label: "Partner With Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/faq", label: "Help Center" },
      { to: "/faq", label: "FAQs" },
      { to: "/legal/privacy", label: "Privacy Policy" },
      { to: "/legal/terms", label: "Terms & Conditions" },
      { to: "/legal/refunds", label: "Cancellation & Refund Policy" },
    ],
  },
];

export function Footer() {
  const { lang, t } = useLang();
  const tr = (s: string) => (lang === "hi" ? (COLUMNS_HI[s] ?? s) : s);
  return (
    <footer className="mt-12 w-full bg-navy text-navy-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div className="min-w-0">
            <Link to="/" aria-label="Apoinmate home" className="inline-flex">
              <img
                src={logo}
                alt="Apoinmate logo"
                className="h-10 w-auto rounded-xl bg-white/95 px-3 py-1.5"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
              {t(
                "AI-powered healthcare and appointment platform helping patients find trusted doctors, book appointments and spend less time waiting.",
                "एआई-संचालित स्वास्थ्य एवं अपॉइंटमेंट प्लेटफ़ॉर्म — भरोसेमंद डॉक्टर खोजें, अपॉइंटमेंट बुक करें और कम इंतज़ार करें।",
              )}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-navy-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> Muzaffarpur,
                Bihar, India
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`tel:${SITE.supportPhone.replaceAll(" ", "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE.supportPhone}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="text-sm font-semibold text-navy-foreground">{tr(col.title)}</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l, i) => (
                    <li key={`${l.to}-${i}`}>
                      <Link
                        to={l.to}
                        className="text-navy-foreground/70 transition-colors hover:text-primary"
                      >
                        {tr(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} Apoinmate.{" "}
            {t("All rights reserved.", "सर्वाधिकार सुरक्षित।")}
          </p>
          <p>
            {t(
              "Apoinmate is a healthcare access platform. It does not provide medical diagnosis or emergency services.",
              "Apoinmate एक स्वास्थ्य पहुँच प्लेटफ़ॉर्म है। यह चिकित्सकीय निदान या आपातकालीन सेवाएं प्रदान नहीं करता।",
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
