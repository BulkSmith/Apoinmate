import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, FileLock2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const title = "Log in or Sign up | Apoinmate";
const description =
  "Access your Apoinmate account to manage appointments, prescriptions and healthcare records, or create a new patient account.";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({
    mode: z.enum(["login", "signup"]).optional(),
    redirect: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { mode, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const tab: "login" | "signup" = mode === "signup" ? "signup" : "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const setTab = (next: "login" | "signup") =>
    navigate({ to: "/auth", search: { mode: next, ...(redirect ? { redirect } : {}) }, replace: true });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created — let's set up your profile");
          navigate({ to: "/onboarding/patient" });
        } else {
          toast.success("Check your email to confirm your account");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to Apoinmate");
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", data.user.id)
          .maybeSingle();
        if (!profile?.onboarding_complete) {
          navigate({ to: "/onboarding/patient" });
        } else if (redirect) {
          navigate({ href: redirect });
        } else {
          navigate({ to: "/dashboard/patient" });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const perks = [
    { icon: CalendarCheck, text: "Book and manage appointments in a few taps" },
    { icon: FileLock2, text: "Keep prescriptions and reports private and handy" },
    { icon: Sparkles, text: "Ask Aira health questions any time" },
    { icon: ShieldCheck, text: "Verified doctors and secure payments" },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:py-16">
        <div className="hidden min-w-0 lg:block">
          <h2 className="text-3xl font-extrabold leading-tight text-navy">
            Healthcare that fits <span className="text-gradient">your schedule.</span>
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            One Apoinmate account for appointments, records and guidance — for you and your family.
          </p>
          <ul className="mt-7 grid gap-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="text-sm text-navy">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center">
            <Logo size="lg" />
            <h1 className="mt-5 text-center text-2xl font-bold text-navy">
              {tab === "signup" ? "Create your Apoinmate account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {tab === "signup"
                ? "It takes less than a minute to get started."
                : "Log in to manage your appointments and records."}
            </p>
          </div>

          <div className="glass-card mt-6 w-full p-6">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1">
              {(["login", "signup"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTab(v)}
                  aria-pressed={tab === v}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    tab === v
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-navy"
                  }`}
                >
                  {v === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              {tab === "signup" && (
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    className="mt-2 h-11 rounded-xl bg-card/80"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 h-11 rounded-xl bg-card/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  className="mt-2 h-11 rounded-xl bg-card/80"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-12 w-full rounded-2xl" disabled={loading}>
                {loading ? "Please wait…" : tab === "signup" ? "Create account" : "Log in"}
              </Button>
            </form>

            <div className="mt-5 rounded-2xl border border-primary/25 bg-primary-soft/60 px-4 py-3 text-center text-sm text-navy">
              {tab === "signup" ? "Are you a doctor? " : "Are you a doctor? "}
              <Link to="/doctor-signup" className="font-semibold text-primary hover:underline">
                {tab === "signup" ? "Click here to sign up" : "Click here to log in"}
              </Link>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {tab === "signup" ? "Already have an account? " : "New to Apoinmate? "}
              <button
                type="button"
                onClick={() => setTab(tab === "signup" ? "login" : "signup")}
                className="font-semibold text-primary hover:underline"
              >
                {tab === "signup" ? "Log in" : "Create one"}
              </button>
            </p>


            <p className="mt-4 text-center text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/legal/terms" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
