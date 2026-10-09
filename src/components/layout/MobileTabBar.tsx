import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Search, Sparkles, User } from "lucide-react";
import { useLang } from "@/lib/i18n";

const ITEMS = [
  { to: "/", label: "Home", hi: "होम", icon: Home },
  { to: "/find-doctors", label: "Doctors", hi: "डॉक्टर", icon: Search },
  { to: "/dashboard/patient", label: "Visits", hi: "बुकिंग", icon: CalendarDays },
  { to: "/ai-assistant", label: "Aira", hi: "आइरा", icon: Sparkles },
  { to: "/auth", label: "Profile", hi: "प्रोफ़ाइल", icon: User },
] as const;

export function MobileTabBar() {
  const { t } = useLang();
  return (
    <nav
      className="glass-strong fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile"
    >
      {ITEMS.map(({ to, label, hi, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          activeProps={{ className: "text-primary" }}
          aria-label={label === "Visits" ? t("Appointments", "अपॉइंटमेंट") : t(label, hi)}
          className="flex min-w-0 flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[11px] font-medium leading-none text-muted-foreground"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {t(label, hi)}
        </Link>
      ))}
    </nav>
  );
}
