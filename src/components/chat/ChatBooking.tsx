import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DOCTORS, TIME_SLOTS } from "@/data/doctors";
import { buildAppointment, createAppointment } from "@/services/appointment-service";
import { SPECIALTIES } from "@/data/specialties";
import { useLang } from "@/lib/i18n";
import { useAuthUser } from "@/hooks/useAuthUser";

function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const ALL_SLOTS = [...TIME_SLOTS.Morning, ...TIME_SLOTS.Afternoon, ...TIME_SLOTS.Evening];

/** Inline appointment booking inside the Aira chat — doctor, date and time without leaving the page. */
export function ChatBooking({
  onClose,
  onBooked,
  initialSpecialty,
}: {
  onClose: () => void;
  onBooked: (summary: string) => void;
  initialSpecialty?: string | undefined;
}) {
  const { t } = useLang();
  const { user, loading } = useAuthUser();
  const [specialty, setSpecialty] = useState(initialSpecialty ?? "");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const doctors = useMemo(
    () => (specialty ? DOCTORS.filter((d) => d.specialtySlug === specialty) : DOCTORS),
    [specialty],
  );
  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const days = nextDays(7);

  async function confirm() {
    if (!user || !doctor || !time) return;
    setBusy(true);
    try {
      await createAppointment(
        buildAppointment({
          userId: user.id,
          doctor,
          date,
          time,
          source: "chat",
        }),
      );
      setDone(true);
      onBooked(
        `${doctor.name} — ${new Date(date).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}, ${time}`,
      );
    } catch {
      toast.error(t("Could not book. Please try again.", "बुकिंग नहीं हो सकी। पुनः प्रयास करें।"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary-soft/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy">
          <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          {t("Book an appointment", "अपॉइंटमेंट बुक करें")}
        </p>
        <button type="button" onClick={onClose} aria-label="Close booking" className="text-muted-foreground hover:text-navy">
          <X className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("Loading…", "लोड हो रहा है…")}
        </p>
      ) : !user ? (
        <div className="mt-3 text-sm text-navy">
          <p>
            {t(
              "Please log in or create an account to book an appointment.",
              "अपॉइंटमेंट बुक करने के लिए लॉग इन करें या खाता बनाएँ।",
            )}
          </p>
          <div className="mt-3 flex gap-2">
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/auth" search={{ mode: "login", redirect: "/ai-assistant" }}>
                {t("Log in", "लॉग इन")}
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-xl bg-card/70">
              <Link to="/auth" search={{ mode: "signup", redirect: "/ai-assistant" }}>
                {t("Sign up", "साइन अप")}
              </Link>
            </Button>
          </div>
        </div>
      ) : done ? (
        <div className="mt-3 flex items-start gap-2 text-sm text-navy">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          <p>
            {t("Appointment confirmed.", "अपॉइंटमेंट कन्फर्म हो गई।")}{" "}
            <Link to="/dashboard/patient" className="font-semibold text-primary hover:underline">
              {t("View in dashboard", "डैशबोर्ड में देखें")}
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              aria-label={t("Specialty", "विशेषज्ञता")}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                setDoctorId("");
              }}
            >
              <option value="">{t("All specialties", "सभी विशेषज्ञताएँ")}</option>
              {SPECIALTIES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              aria-label={t("Doctor", "डॉक्टर")}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">{t("Choose a doctor", "डॉक्टर चुनें")}</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — ₹{d.fee}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => {
              const value = d.toISOString().slice(0, 10);
              const on = value === date;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDate(value)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium ${
                    on ? "bg-primary text-primary-foreground" : "bg-card text-navy ring-1 ring-border"
                  }`}
                >
                  {d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTime(s)}
                className={`rounded-xl px-2.5 py-1.5 text-xs font-medium ${
                  time === s ? "bg-primary text-primary-foreground" : "bg-card text-navy ring-1 ring-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            className="h-11 w-full rounded-xl"
            disabled={!doctor || !time || busy}
            onClick={() => void confirm()}
          >
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {doctor
              ? t(`Confirm • ₹${doctor.fee}`, `कन्फर्म करें • ₹${doctor.fee}`)
              : t("Confirm appointment", "अपॉइंटमेंट कन्फर्म करें")}
          </Button>
        </div>
      )}
    </div>
  );
}
