import type { LucideIcon } from "lucide-react";
import { Settings, LogOut } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useLang } from "@/lib/i18n";
import { greetingFor, initialsOf } from "@/hooks/useAuthUser";

export type NavItem = { key: string; label: string; icon: LucideIcon };

export function DashboardShell({
  items,
  active,
  onChange,
  name,
  subtitle,
  avatarUrl,
  children,
}: {
  items: NavItem[];
  active: string;
  onChange: (key: string) => void;
  name: string;
  subtitle?: string;
  avatarUrl?: string | null;
  children: React.ReactNode;
}) {
  const { t } = useLang();
  const navigate = useNavigate();
  const router = useRouter();
  const greeting = greetingFor();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(
        t("Could not sign out. Please try again.", "साइन आउट नहीं हो सका। फिर से प्रयास करें।"),
      );
      return;
    }
    toast.success(t("Signed out", "साइन आउट हो गए"));
    await router.invalidate();
    void navigate({ to: "/", replace: true });
  }

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const on = active === item.key;
    return (
      <button
        type="button"
        onClick={() => onChange(item.key)}
        aria-current={on ? "page" : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
          on
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-navy/75 hover:bg-primary-soft hover:text-primary"
        }`}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="glass-card mb-6 flex flex-col p-4 lg:sticky lg:top-24 lg:mb-0 lg:h-[calc(100vh-8rem)]">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-base font-bold text-primary">
                {initialsOf(name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t(greeting.en, greeting.hi)},</p>
              <p className="truncate text-sm font-semibold text-navy">{name}</p>
              {subtitle && (
                <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Dashboard">
            {items.map((item) => (
              <NavButton key={item.key} item={item} />
            ))}
          </nav>

          <div className="mt-4 space-y-1 border-t border-border/60 pt-3">
            <NavButton
              item={{ key: "settings", label: t("Profile settings", "प्रोफ़ाइल सेटिंग"), icon: Settings }}
            />
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-navy/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {t("Sign out", "साइन आउट")}
            </button>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </SiteLayout>
  );
}
