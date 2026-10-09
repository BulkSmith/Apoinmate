import { Link } from "@tanstack/react-router";
import { Languages, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const NAV = [
    { to: "/find-doctors", label: t("Find Doctors", "डॉक्टर खोजें") },
    { to: "/services", label: t("Services", "सेवाएं") },
    { to: "/ai-assistant", label: t("Aira AI", "आइरा एआई") },
    { to: "/for-doctors", label: t("For Doctors", "डॉक्टरों के लिए") },
    { to: "/about", label: t("About", "हमारे बारे में") },
  ] as const;

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div
      className={`glass inline-flex shrink-0 items-center rounded-xl p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      <Languages className="mx-1.5 h-3.5 w-3.5 text-primary" aria-hidden="true" />
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-navy/70 hover:text-primary"
          }`}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-x-0 border-t-0">
        <nav
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"
          aria-label="Main"
        >
          <Logo className="shrink-0" />

          <div className="hidden min-w-0 items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-primary bg-primary-soft" }}
                className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-navy/80 transition-colors hover:bg-primary-soft hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LangToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" className="hidden rounded-xl xl:inline-flex">
              <Link to="/auth" search={{ mode: "login" }}>
                {t("Log in", "लॉग इन")}
              </Link>
            </Button>
            <Button asChild className="hidden rounded-xl xl:inline-flex">
              <Link to="/auth" search={{ mode: "signup" }}>
                {t("Sign up", "साइन अप")}
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl xl:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto p-6">
                <Logo className="mb-4" />
                <LangToggle className="mb-4" />
                <div className="flex flex-col gap-1">
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-primary-soft"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-primary-soft"
                  >
                    {t("Contact", "संपर्क")}
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-primary-soft"
                  >
                    {t("Help / FAQ", "सहायता / प्रश्न")}
                  </Link>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)}>
                      {t("Log in", "लॉग इन")}
                    </Link>
                  </Button>
                  <Button asChild className="rounded-xl">
                    <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>
                      {t("Sign up", "साइन अप")}
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="rounded-xl">
                    <Link to="/ai-assistant" onClick={() => setOpen(false)}>
                      <Sparkles className="mr-2 h-4 w-4" /> {t("Ask Aira", "आइरा से पूछें")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
