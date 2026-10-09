import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { listListedDoctors } from "@/lib/listings.functions";
import { useLang } from "@/lib/i18n";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useServerFn } from "@tanstack/react-start";
import type { Doctor } from "@/types/doctor";

/** Helps users find a doctor, then continues through the existing booking flow. */
export function ChatBooking({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const { user, loading: authLoading } = useAuthUser();
  const getListedDoctors = useServerFn(listListedDoctors);
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [listedDoctors, setListedDoctors] = useState<Doctor[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState(false);

  useEffect(() => {
    let active = true;
    void getListedDoctors()
      .then((doctors) => {
        if (active) setListedDoctors(doctors);
      })
      .catch(() => {
        if (!active) return;
        setDirectoryError(true);
        toast.error(t("Could not refresh doctor listings.", "डॉक्टरों की सूची अपडेट नहीं हो सकी।"));
      })
      .finally(() => {
        if (active) setDirectoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [getListedDoctors, t]);

  const doctors = useMemo(() => {
    const combined = [...DOCTORS, ...listedDoctors];
    const unique = [...new Map(combined.map((doctor) => [doctor.id, doctor])).values()];
    return specialty ? unique.filter((doctor) => doctor.specialtySlug === specialty) : unique;
  }, [listedDoctors, specialty]);
  const doctor = doctors.find((item) => item.id === doctorId);
  const specialties = [
    ...new Set([...DOCTORS, ...listedDoctors].map((item) => item.specialtySlug)),
  ];

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary-soft/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy">
          <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          {t("Find a doctor to book", "बुकिंग के लिए डॉक्टर खोजें")}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close doctor search"
          className="text-muted-foreground hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {directoryLoading ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />{" "}
          {t("Loading doctors…", "डॉक्टर लोड हो रहे हैं…")}
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {directoryError && (
            <p className="text-xs text-muted-foreground">
              {t(
                "Live listings could not be refreshed. Check Find Doctors for the current directory.",
                "लाइव सूची अपडेट नहीं हो सकी। वर्तमान सूची के लिए डॉक्टर खोजें पेज देखें।",
              )}
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              aria-label={t("Specialty", "विशेषज्ञता")}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
              value={specialty}
              onChange={(event) => {
                setSpecialty(event.target.value);
                setDoctorId("");
              }}
            >
              <option value="">{t("All specialties", "सभी विशेषज्ञताएँ")}</option>
              {specialties.map((value) => (
                <option key={value} value={value}>
                  {value.replaceAll("-", " ")}
                </option>
              ))}
            </select>
            <select
              aria-label={t("Doctor", "डॉक्टर")}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
            >
              <option value="">{t("Choose a doctor", "डॉक्टर चुनें")}</option>
              {doctors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.city} · ₹{item.fee}
                </option>
              ))}
            </select>
          </div>

          {doctor && (
            <div className="rounded-xl bg-card p-3 text-sm text-navy ring-1 ring-border">
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-muted-foreground">
                {doctor.specialty} · {doctor.city} · ₹{doctor.fee}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t(
                  "Continue to the booking page to review the available options and confirm your appointment.",
                  "उपलब्ध विकल्प देखने और अपॉइंटमेंट की पुष्टि के लिए बुकिंग पेज पर जाएँ।",
                )}
              </p>
            </div>
          )}

          {authLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              {t("Checking login…", "लॉगिन जाँचा जा रहा है…")}
            </p>
          ) : !user ? (
            <div className="flex flex-wrap gap-2">
              {doctor ? (
                <>
                  <Button asChild size="sm" className="rounded-xl">
                    <Link
                      to="/auth"
                      search={{
                        mode: "login",
                        redirect: `/book/${encodeURIComponent(doctor.id)}`,
                      }}
                    >
                      {t("Log in to continue", "जारी रखने के लिए लॉग इन करें")}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-xl bg-card/70">
                    <Link
                      to="/auth"
                      search={{
                        mode: "signup",
                        redirect: `/book/${encodeURIComponent(doctor.id)}`,
                      }}
                    >
                      {t("Sign up", "साइन अप")}
                    </Link>
                  </Button>
                </>
              ) : (
                <Button size="sm" className="rounded-xl" disabled>
                  {t("Choose a doctor to continue", "जारी रखने के लिए डॉक्टर चुनें")}
                </Button>
              )}
            </div>
          ) : doctor ? (
            <Button asChild className="h-11 w-full rounded-xl">
              <Link to="/book/$doctorId" params={{ doctorId: doctor.id }}>
                {t("Continue to booking", "बुकिंग जारी रखें")}
              </Link>
            </Button>
          ) : (
            <Button className="h-11 w-full rounded-xl" disabled>
              {t("Choose a doctor to continue", "जारी रखने के लिए डॉक्टर चुनें")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
