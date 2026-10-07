import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, IndianRupee, Loader2, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLang } from "@/lib/i18n";

export type ClinicAppointment = Database["public"]["Tables"]["appointments"]["Row"];

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** Loads all appointments booked with this doctor's listing (RLS: doctor_id = auth.uid()). */
export function useClinicAppointments(doctorId: string) {
  const [items, setItems] = useState<ClinicAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  async function update(id: string, patch: Partial<ClinicAppointment>) {
    const { error } = await supabase.from("appointments").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  const stats = useMemo(() => {
    const today = todayISO();
    const month = today.slice(0, 7);
    const active = items.filter((a) => a.status !== "cancelled");
    return {
      today: active.filter((a) => a.appointment_date === today).length,
      patients: new Set(active.map((a) => a.user_id)).size,
      monthPaid: active
        .filter((a) => a.payment_status === "paid" && a.appointment_date.startsWith(month))
        .reduce((s, a) => s + a.fee, 0),
      pending: active.filter((a) => a.payment_status !== "paid").reduce((s, a) => s + a.fee, 0),
    };
  }, [items]);

  return { items, loading, update, stats };
}

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

function Pill({ tone, children }: { tone: "success" | "warning" | "muted" | "destructive"; children: React.ReactNode }) {
  const cls = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    muted: "bg-muted text-navy",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${cls}`}>{children}</span>;
}

export function AppointmentsPanel({ data }: { data: ReturnType<typeof useClinicAppointments> }) {
  const { t } = useLang();
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const today = todayISO();
  const list = data.items.filter((a) =>
    view === "upcoming" ? a.appointment_date >= today && a.status !== "completed" : a.appointment_date < today || a.status === "completed",
  );

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy">{t("Appointments", "अपॉइंटमेंट")}</h2>
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {(["upcoming", "past"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view === v ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              {v === "upcoming" ? t("Upcoming", "आगामी") : t("Past", "पिछली")}
            </button>
          ))}
        </div>
      </div>

      {data.loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {t("No appointments here yet.", "अभी कोई अपॉइंटमेंट नहीं।")}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border/60">
          {list.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="flex w-20 flex-col items-center rounded-xl bg-primary-soft py-2 text-primary">
                <span className="text-[11px] font-semibold">{fmtDate(a.appointment_date)}</span>
                <span className="text-sm font-bold">{a.appointment_time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{a.patient_name || t("Patient", "मरीज़")}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.consultation_type} · ₹{a.fee}{a.notes ? ` · ${a.notes}` : ""}
                </p>
              </div>
              <Pill tone={a.status === "cancelled" ? "destructive" : a.status === "completed" ? "success" : "muted"}>{a.status}</Pill>
              <Pill tone={a.payment_status === "paid" ? "success" : "warning"}>{a.payment_status}</Pill>
              {a.status === "confirmed" && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => void data.update(a.id, { status: "completed" })}>
                    <CheckCircle2 className="h-4 w-4" /> {t("Done", "पूर्ण")}
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-lg text-destructive" onClick={() => void data.update(a.id, { status: "cancelled" })}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EarningsPanel({ data }: { data: ReturnType<typeof useClinicAppointments> }) {
  const { t } = useLang();
  const billable = data.items.filter((a) => a.status !== "cancelled");
  const paid = billable.filter((a) => a.payment_status === "paid");
  const total = paid.reduce((s, a) => s + a.fee, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Wallet, label: t("Total received", "कुल प्राप्त"), value: `₹${total}` },
          { icon: IndianRupee, label: t("This month", "इस माह"), value: `₹${data.stats.monthPaid}` },
          { icon: CalendarDays, label: t("Pending", "बकाया"), value: `₹${data.stats.pending}` },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold text-navy">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-navy">{t("Patient payments", "मरीज़ भुगतान")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("Mark a fee as received when the patient pays at the clinic.", "क्लिनिक पर भुगतान मिलने पर इसे प्राप्त चिह्नित करें।")}
        </p>
        {billable.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("No payments yet.", "अभी कोई भुगतान नहीं।")}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {billable.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-navy">
                  <span className="font-semibold">{a.patient_name || t("Patient", "मरीज़")}</span>{" "}
                  <span className="text-muted-foreground">· {fmtDate(a.appointment_date)}</span>
                </span>
                <span className="font-semibold text-navy">₹{a.fee}</span>
                {a.payment_status === "paid" ? (
                  <Pill tone="success">{t("Received", "प्राप्त")}</Pill>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-lg"
                    onClick={() => void data.update(a.id, { payment_status: "paid", paid_at: new Date().toISOString() })}
                  >
                    {t("Mark received", "प्राप्त चिह्नित करें")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type Day = { weekday: number; start_time: string; end_time: string; slot_minutes: number; is_active: boolean };
const DAYS = [
  ["Sun", "रवि"], ["Mon", "सोम"], ["Tue", "मंगल"], ["Wed", "बुध"], ["Thu", "गुरु"], ["Fri", "शुक्र"], ["Sat", "शनि"],
] as const;

export function SchedulePanel({ userId }: { userId: string }) {
  const { t } = useLang();
  const [days, setDays] = useState<Day[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void supabase.from("doctor_schedules").select("*").eq("user_id", userId).then(({ data }) => {
      setDays(
        DAYS.map((_, i) => {
          const r = data?.find((d) => d.weekday === i);
          return r
            ? { weekday: i, start_time: r.start_time, end_time: r.end_time, slot_minutes: r.slot_minutes, is_active: r.is_active }
            : { weekday: i, start_time: "10:00", end_time: "18:00", slot_minutes: 15, is_active: i !== 0 };
        }),
      );
    });
  }, [userId]);

  const set = (i: number, patch: Partial<Day>) => setDays((d) => d.map((x) => (x.weekday === i ? { ...x, ...patch } : x)));

  async function save() {
    if (days.some((d) => d.is_active && d.start_time >= d.end_time)) {
      toast.error(t("End time must be after start time", "समाप्ति समय शुरुआत के बाद होना चाहिए"));
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("doctor_schedules")
      .upsert(days.map((d) => ({ ...d, user_id: userId })), { onConflict: "user_id,weekday" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(t("Schedule saved", "शेड्यूल सहेजा गया"));
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-navy">{t("Weekly schedule", "साप्ताहिक शेड्यूल")}</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("Set the days and hours patients can book you.", "वे दिन और समय चुनें जब मरीज़ बुक कर सकें।")}
      </p>
      <div className="mt-4 space-y-2">
        {days.map((d) => (
          <div key={d.weekday} className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3">
            <Switch checked={d.is_active} onCheckedChange={(v) => set(d.weekday, { is_active: v })} aria-label={DAYS[d.weekday]![0]} />
            <span className="w-12 text-sm font-semibold text-navy">{t(DAYS[d.weekday]![0], DAYS[d.weekday]![1])}</span>
            {d.is_active ? (
              <>
                <Input type="time" value={d.start_time} onChange={(e) => set(d.weekday, { start_time: e.target.value })} className="h-9 w-32" />
                <span className="text-xs text-muted-foreground">–</span>
                <Input type="time" value={d.end_time} onChange={(e) => set(d.weekday, { end_time: e.target.value })} className="h-9 w-32" />
                <select
                  value={d.slot_minutes}
                  onChange={(e) => set(d.weekday, { slot_minutes: Number(e.target.value) })}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {[10, 15, 20, 30].map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">{t("Closed", "बंद")}</span>
            )}
          </div>
        ))}
      </div>
      <Button className="mt-5 h-11 rounded-2xl px-6" onClick={() => void save()} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} {t("Save schedule", "शेड्यूल सहेजें")}
      </Button>
    </div>
  );
}
