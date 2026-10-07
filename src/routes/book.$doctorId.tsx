import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  IndianRupee,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getDoctor, TIME_SLOTS } from "@/data/doctors";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getListedDoctor } from "@/lib/listings.functions";
import { buildAppointment, createAppointment } from "@/services/appointment-service";

export const Route = createFileRoute("/book/$doctorId")({
  loader: async ({ params }) => {
    const doctor = getDoctor(params.doctorId) ?? (await getListedDoctor({ data: { id: params.doctorId } }));
    if (!doctor) throw notFound();
    return { doctor };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doctor;
    const title = d ? `Book an appointment with ${d.name} | Apoinmate` : "Book appointment | Apoinmate";
    const description = d
      ? `Choose a date and time slot to book an in-clinic appointment with ${d.name} at ${d.clinic}, ${d.city}.`
      : "Book a doctor appointment in a few simple steps on Apoinmate.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Doctor not found</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Browse doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Booking couldn&apos;t load</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Browse doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: BookAppointment,
});

const STEPS = ["Consultation", "Date", "Time", "Patient", "Payment", "Confirmed"];
const PLATFORM_FEE = 29;

function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

type PaymentStatus = "processing" | "paid" | "failed";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 5;

function BookAppointment() {
  const { doctor } = Route.useLoaderData();
  const { user, loading: authLoading } = useAuthUser();
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState("");
  const [patient, setPatient] = useState({ name: "", phone: "", age: "", gender: "Female", notes: "" });
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [payStatus, setPayStatus] = useState<PaymentStatus>("processing");
  const [pollCount, setPollCount] = useState(0);
  const [checking, setChecking] = useState(false);
  const pollsRef = useRef(0);

  const bookingId = useMemo(
    () => `APM${Math.floor(100000 + Math.random() * 899999)}`,
    [],
  );

  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canContinue =
    (step === 0) ||
    (step === 1 && Boolean(date)) ||
    (step === 2 && Boolean(slot)) ||
    (step === 3 && patient.name.trim().length > 1 && /^\d{10}$/.test(patient.phone)) ||
    step === 4;

  const total = doctor.fee + PLATFORM_FEE;

  function chooseDate(d: Date) {
    setDate(d);
    toast.success("Date selected", {
      description: d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
  }

  function chooseSlot(t: string) {
    setSlot(t);
    toast.success("Slot confirmed", {
      description: `${doctor.name} · ${dateLabel} at ${t}`,
    });
  }

  // Simulates the gateway (Razorpay/Stripe) status check. Wire the real
  // "fetch payment by order id" call here; the polling/retry UI stays the same.
  function fetchPaymentStatus(): Promise<PaymentStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        pollsRef.current += 1;
        // Settles as paid on the 2nd check in the demo.
        resolve(pollsRef.current >= 2 ? "paid" : "processing");
      }, 700);
    });
  }

  async function checkStatus(manual = false) {
    if (checking) return;
    setChecking(true);
    try {
      const s = await fetchPaymentStatus();
      setPayStatus(s);
      setPollCount((c) => c + 1);
      if (s === "paid") {
        toast.success("Payment received", {
          description: `Appointment with ${doctor.name} confirmed · ${dateLabel} · ${slot}`,
        });
      } else if (s === "failed") {
        toast.error("Payment failed", { description: "No money was deducted. Please retry." });
      } else if (manual) {
        toast.info("Still processing", { description: "Your bank hasn't confirmed yet. We'll keep checking." });
      }
    } catch {
      if (manual) toast.error("Couldn't reach the payment gateway", { description: "Please try again." });
    } finally {
      setChecking(false);
    }
  }

  // Auto-poll while the payment is processing on the success screen.
  useEffect(() => {
    if (step !== 5 || payStatus !== "processing" || pollCount >= MAX_POLLS) return;
    const id = setTimeout(() => void checkStatus(false), POLL_INTERVAL_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, payStatus, pollCount]);

  async function pay() {
    setProcessing(true);
    if (user) {
      const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      try {
        await createAppointment({
          ...buildAppointment({
            userId: user.id,
            doctor,
            date: d.toISOString().slice(0, 10),
            time: slot,
            source: "web",
            notes: patient.notes || null,
          }),
          patient_name: patient.name,
          payment_status: "pending",
          payment_method: method,
        });
      } catch {
        setProcessing(false);
        toast.error("Couldn't save your appointment", { description: "Please try again." });
        return;
      }
    }
    setTimeout(() => {
      setProcessing(false);
      pollsRef.current = 0;
      setPollCount(0);
      setPayStatus("processing");
      setStep(5);
      toast.info("Payment submitted", {
        description: "Waiting for your bank / UPI app to confirm…",
      });
    }, 1200);
  }

  function retryPayment() {
    pollsRef.current = 0;
    setPollCount(0);
    setPayStatus("processing");
    setStep(4);
  }

  const pollTimedOut = payStatus === "processing" && pollCount >= MAX_POLLS;


  if (authLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-muted-foreground">
          Checking your session…
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    const redirectTo = `/book/${doctor.id}`;
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <div className="glass-card p-6 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h1 className="mt-3 text-2xl font-bold text-navy">Login required to book</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              To confirm an appointment with {doctor.name} we need an account so we can send
              reminders and keep your appointment history secure.
            </p>
            <div className="mt-6 grid gap-2">
              <Button asChild className="h-11 rounded-xl">
                <Link to="/auth" search={{ mode: "login", redirect: redirectTo }}>
                  Login to continue
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl">
                <Link to="/auth" search={{ mode: "signup", redirect: redirectTo }}>
                  New patient? Create an account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          to="/doctors/$doctorId"
          params={{ doctorId: doctor.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-navy">Book an appointment</h1>

        <ol className="glass mt-6 flex flex-wrap gap-2 rounded-2xl p-3" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-success/12 text-success"
                    : "text-muted-foreground"
              }`}
            >
              <span>{i + 1}</span> {s}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="glass-card p-6 sm:p-8">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Consultation type</h2>
                <RadioGroup value="clinic" className="mt-4 space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-card/80 p-4 ring-1 ring-primary">
                    <RadioGroupItem value="clinic" id="clinic" className="mt-1" />
                    <span>
                      <span className="block font-semibold text-navy">Clinic visit</span>
                      <span className="block text-sm text-muted-foreground">
                        Meet {doctor.name} in person at {doctor.clinic}, {doctor.area}.
                      </span>
                    </span>
                  </label>
                  <div className="flex items-start gap-3 rounded-2xl bg-muted p-4 opacity-70">
                    <span className="mt-1 h-4 w-4 rounded-full border border-muted-foreground" />
                    <span>
                      <span className="block font-semibold text-navy">Online consultation</span>
                      <span className="block text-sm text-muted-foreground">Coming soon</span>
                    </span>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Select a date</h2>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {nextDays(10).map((d) => {
                    const active = d.toDateString() === date.toDateString();
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        onClick={() => chooseDate(d)}
                        className={`rounded-2xl px-3 py-3 text-center text-sm ring-1 transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground ring-primary"
                            : "bg-card/80 text-navy ring-border hover:ring-primary"
                        }`}
                      >
                        <span className="block text-xs opacity-80">
                          {d.toLocaleDateString("en-IN", { weekday: "short" })}
                        </span>
                        <span className="block text-lg font-semibold">{d.getDate()}</span>
                        <span className="block text-xs opacity-80">
                          {d.toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Select a time slot</h2>
                <p className="mt-1 text-sm text-muted-foreground">{dateLabel}</p>
                <div className="mt-4 space-y-5">
                  {Object.entries(TIME_SLOTS).map(([part, slots]) => (
                    <div key={part}>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {part}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {slots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => chooseSlot(t)}
                            className={`rounded-xl px-4 py-2.5 text-sm ring-1 transition-colors ${
                              slot === t
                                ? "bg-primary text-primary-foreground ring-primary"
                                : "bg-card/80 text-navy ring-border hover:ring-primary"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Patient information</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="p-name">Full name</Label>
                    <Input
                      id="p-name"
                      className="mt-2 h-11 rounded-xl bg-card/80"
                      value={patient.name}
                      onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                      placeholder="e.g. Sunil Kumar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-phone">Mobile number</Label>
                    <Input
                      id="p-phone"
                      inputMode="numeric"
                      className="mt-2 h-11 rounded-xl bg-card/80"
                      value={patient.phone}
                      onChange={(e) =>
                        setPatient({ ...patient, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                      }
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-age">Age</Label>
                    <Input
                      id="p-age"
                      inputMode="numeric"
                      className="mt-2 h-11 rounded-xl bg-card/80"
                      value={patient.age}
                      onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                      placeholder="e.g. 34"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="p-notes">Reason for visit (optional)</Label>
                    <Textarea
                      id="p-notes"
                      className="mt-2 rounded-xl bg-card/80"
                      value={patient.notes}
                      onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
                      placeholder="Briefly describe your symptoms"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-semibold text-navy">Payment</h2>
                <RadioGroup value={method} onValueChange={setMethod} className="mt-4 space-y-3">
                  {[
                    { id: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm, BHIM" },
                    { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay" },
                    { id: "netbanking", label: "Net banking", hint: "All major Indian banks" },
                    { id: "wallet", label: "Wallets", hint: "Where supported" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-card/80 p-4 ring-1 ${
                        method === m.id ? "ring-primary" : "ring-border"
                      }`}
                    >
                      <RadioGroupItem value={m.id} id={m.id} className="mt-1" />
                      <span>
                        <span className="block font-semibold text-navy">{m.label}</span>
                        <span className="block text-sm text-muted-foreground">{m.hint}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  Payments are processed by a PCI-compliant gateway (Razorpay integration-ready).
                  Apoinmate never stores your card details.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="text-center" aria-live="polite">
                {payStatus === "paid" ? (
                  <>
                    <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
                    <h2 className="mt-4 text-2xl font-bold text-navy">Appointment confirmed</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      A confirmation has been sent to your mobile number. Please arrive 10 minutes
                      before your slot.
                    </p>
                  </>
                ) : payStatus === "failed" ? (
                  <>
                    <AlertTriangle className="mx-auto h-14 w-14 text-destructive" aria-hidden="true" />
                    <h2 className="mt-4 text-2xl font-bold text-navy">Payment failed</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your bank declined or cancelled the payment. No money was deducted and your
                      slot is held for a few minutes — retry to complete the booking.
                    </p>
                  </>
                ) : (
                  <>
                    <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" aria-hidden="true" />
                    <h2 className="mt-4 text-2xl font-bold text-navy">
                      {pollTimedOut ? "Still waiting on your bank" : "Payment processing…"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {pollTimedOut
                        ? "The gateway hasn't confirmed yet. If money was deducted, it will be auto-refunded within 5–7 days if the booking doesn't go through. You can check again or retry."
                        : "We're confirming with the payment gateway. This usually takes a few seconds — please don't close this page."}
                    </p>
                  </>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      payStatus === "paid"
                        ? "bg-success/12 text-success"
                        : payStatus === "failed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/15 text-warning-foreground"
                    }`}
                  >
                    Order status:{" "}
                    {payStatus === "paid" ? "Confirmed" : payStatus === "failed" ? "Not confirmed" : "Pending payment"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-navy">
                    {payStatus === "processing" && (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    )}
                    Payment: {payStatus === "paid" ? "Paid" : payStatus === "failed" ? "Failed" : "Processing"}
                  </span>
                </div>

                {payStatus !== "paid" && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {payStatus === "processing" && (
                      <Button
                        variant="outline"
                        className="rounded-xl bg-card/70"
                        disabled={checking}
                        onClick={() => void checkStatus(true)}
                      >
                        {checking ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        {checking ? "Checking…" : "Check status now"}
                      </Button>
                    )}
                    <Button className="rounded-xl" onClick={retryPayment}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Retry payment
                    </Button>
                    {payStatus === "processing" && !pollTimedOut && (
                      <p className="w-full text-xs text-muted-foreground">
                        Auto-checking every {POLL_INTERVAL_MS / 1000}s · attempt {pollCount + 1} of {MAX_POLLS}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                  <Detail label="Doctor" value={`${doctor.name} · ${doctor.specialty}`} />
                  <Detail label="Booking ID" value={bookingId} />
                  <Detail label="Date" value={dateLabel} />
                  <Detail label="Time" value={slot} />
                  <Detail label="Location" value={`${doctor.clinic}, ${doctor.area}, ${doctor.city}`} />
                  <Detail
                    label="Payment status"
                    value={`${payStatus === "paid" ? "Paid" : payStatus === "failed" ? "Failed" : "Processing"} · ₹${total}`}
                  />
                </div>

                {payStatus === "paid" && (
                  <>
                    <div className="mt-6 flex flex-col items-center gap-3">
                      <QrPlaceholder value={bookingId} />
                      <p className="text-xs text-muted-foreground">
                        Show this code at the clinic reception
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <Button variant="outline" className="rounded-xl bg-card/70" onClick={() => window.print()}>
                        <Download className="mr-2 h-4 w-4" /> Download confirmation
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl bg-card/70"
                        onClick={() => toast.info("Calendar file will be emailed with your confirmation")}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" /> Add to calendar
                      </Button>
                      <Button asChild className="rounded-xl">
                        <Link to="/dashboard/patient">Go to my dashboard</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {step < 5 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  className="rounded-xl"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                {step === 4 ? (
                  <Button
                    size="lg"
                    className="h-12 rounded-2xl px-8"
                    disabled={processing}
                    onClick={pay}
                  >
                    {processing ? "Processing…" : `Pay ₹${total}`}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="h-12 rounded-2xl px-8"
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Summary
              </h2>
              <p className="mt-3 font-semibold text-navy">{doctor.name}</p>
              <p className="text-sm text-primary">{doctor.specialty}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" aria-hidden="true" /> In-clinic
                  consultation
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> {doctor.clinic},{" "}
                  {doctor.city}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" /> {dateLabel}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
                  {slot || "Select a time slot"}
                </li>
              </ul>

              <Separator className="my-5" />

              <dl className="space-y-2 text-sm">
                <Row label="Consultation fee" value={`₹${doctor.fee}`} />
                <Row label="Platform / convenience fee" value={`₹${PLATFORM_FEE}`} />
              </dl>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-base font-bold text-navy">
                <span>Total</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4" aria-hidden="true" />
                  {total}
                </span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Free cancellation up to 2 hours before the appointment. Refunds follow our
                cancellation policy.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card/80 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-navy">{value}</p>
    </div>
  );
}

function QrPlaceholder({ value }: { value: string }) {
  const cells = Array.from({ length: 100 }, (_, i) => {
    const code = value.charCodeAt(i % value.length) + i * 7;
    return code % 3 === 0;
  });
  return (
    <div
      className="grid grid-cols-10 gap-0.5 rounded-2xl bg-card p-3 ring-1 ring-border"
      aria-label={`Appointment QR code for booking ${value}`}
      role="img"
    >
      {cells.map((on, i) => (
        <span
          key={i}
          className={`h-3 w-3 rounded-[2px] ${on ? "bg-navy" : "bg-transparent"}`}
        />
      ))}
    </div>
  );
}
