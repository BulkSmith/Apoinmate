import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  FileUp,
  Loader2,
  Trash2,
  UserPlus,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { meta } from "@/components/pages/PageKit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useLang } from "@/lib/i18n";
import { BIHAR_CITIES } from "@/data/locations";
import { SPECIALTIES } from "@/data/specialties";

export const Route = createFileRoute("/doctor-signup")({
  ssr: false,
  head: () =>
    meta(
      "Doctor registration — join Apoinmate",
      "Create your doctor account, build your profile, upload verification documents and add a payout method to start receiving Apoinmate appointments.",
    ),
  component: DoctorSignup,
});

type DocFile = { path: string; name: string; label: string };

type AppRow = {
  full_name: string;
  phone: string;
  specialty: string;
  qualification: string;
  experience_years: number | null;
  registration_number: string;
  registration_council: string;
  clinic_name: string;
  city: string;
  area: string;
  consultation_fee: number | null;
  languages: string;
  about: string;
  documents: DocFile[];
  payout_method: string;
  payout_upi: string;
  payout_account_name: string;
  payout_account_number: string;
  payout_ifsc: string;
  status: string;
  current_step: number;
};

const EMPTY: AppRow = {
  full_name: "",
  phone: "",
  specialty: "",
  qualification: "",
  experience_years: null,
  registration_number: "",
  registration_council: "Bihar Medical Council",
  clinic_name: "",
  city: "Muzaffarpur",
  area: "",
  consultation_fee: null,
  languages: "Hindi, English",
  about: "",
  documents: [],
  payout_method: "upi",
  payout_upi: "",
  payout_account_name: "",
  payout_account_number: "",
  payout_ifsc: "",
  status: "draft",
  current_step: 1,
};

const DOC_LABELS = [
  { key: "degree", en: "Medical degree certificate", hi: "मेडिकल डिग्री प्रमाणपत्र" },
  { key: "registration", en: "Medical council registration", hi: "मेडिकल काउंसिल पंजीकरण" },
  { key: "id", en: "Government photo ID", hi: "सरकारी फोटो पहचान पत्र" },
  { key: "clinic", en: "Clinic proof (optional)", hi: "क्लीनिक प्रमाण (वैकल्पिक)" },
];

function Stepper({ step }: { step: number }) {
  const { t } = useLang();
  const labels = [
    { icon: UserPlus, en: "Account", hi: "खाता" },
    { icon: Stethoscope, en: "Profile", hi: "प्रोफ़ाइल" },
    { icon: FileUp, en: "Documents", hi: "दस्तावेज़" },
    { icon: Banknote, en: "Payout", hi: "भुगतान" },
  ];
  return (
    <ol className="flex flex-wrap gap-2">
      {labels.map((l, i) => {
        const Icon = l.icon;
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li
            key={l.en}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              state === "current"
                ? "bg-primary text-primary-foreground"
                : state === "done"
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {state === "done" ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Icon className="h-4 w-4" aria-hidden="true" />
            )}
            {t(l.en, l.hi)}
          </li>
        );
      })}
    </ol>
  );
}

function DoctorSignup() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const [step, setStep] = useState(0);
  const [row, setRow] = useState<AppRow>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  // account form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountMode, setAccountMode] = useState<"signup" | "login">("signup");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setStep(0);
      setReady(true);
      return;
    }
    void supabase
      .from("doctor_applications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setRow({ ...EMPTY, ...(data as unknown as AppRow), documents: (data.documents as unknown as DocFile[]) ?? [] });
          setStep(data.status === "submitted" ? 4 : Math.max(1, data.current_step));
        } else {
          setStep(1);
        }
        setReady(true);
      });
  }, [user, loading]);

  const set = <K extends keyof AppRow>(k: K, v: AppRow[K]) => setRow((r) => ({ ...r, [k]: v }));

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (accountMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/doctor-signup`,
            data: { full_name: accountName, role: "doctor" },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success(t("Check your email to confirm, then return here.", "पुष्टि के लिए ईमेल देखें, फिर यहाँ लौटें।"));
          return;
        }
        setRow((r) => ({ ...r, full_name: accountName }));
        setStep(1);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("Welcome back, doctor", "वापसी पर स्वागत है, डॉक्टर"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function persist(next: number, status: string = "draft") {
    if (!user) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("doctor_applications").upsert(
        {
          user_id: user.id,
          full_name: row.full_name,
          phone: row.phone,
          specialty: row.specialty,
          qualification: row.qualification,
          experience_years: row.experience_years,
          registration_number: row.registration_number,
          registration_council: row.registration_council,
          clinic_name: row.clinic_name,
          city: row.city,
          area: row.area,
          consultation_fee: row.consultation_fee,
          languages: row.languages,
          about: row.about,
          documents: row.documents as unknown as never,
          payout_method: row.payout_method,
          payout_upi: row.payout_upi,
          payout_account_name: row.payout_account_name,
          payout_account_number: row.payout_account_number,
          payout_ifsc: row.payout_ifsc,
          current_step: next,
          status,
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
      setStep(next);
      if (status === "submitted") toast.success(t("Application submitted for verification", "आवेदन सत्यापन के लिए भेजा गया"));
    } catch {
      toast.error(t("Could not save. Please try again.", "सहेजा नहीं जा सका। पुनः प्रयास करें।"));
    } finally {
      setBusy(false);
    }
  }

  async function uploadDoc(label: string, file: File) {
    if (!user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("File is too large (max 10 MB)", "फ़ाइल बहुत बड़ी है (अधिकतम 10 MB)"));
      return;
    }
    setBusy(true);
    try {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${user.id}/${crypto.randomUUID()}-${safe}`;
      const { error } = await supabase.storage
        .from("doctor-documents")
        .upload(path, file, { contentType: file.type || "application/octet-stream" });
      if (error) throw error;
      setRow((r) => ({ ...r, documents: [...r.documents, { path, name: file.name, label }] }));
      toast.success(t("Document uploaded", "दस्तावेज़ अपलोड हुआ"));
    } catch {
      toast.error(t("Upload failed", "अपलोड विफल"));
    } finally {
      setBusy(false);
    }
  }

  async function removeDoc(path: string) {
    await supabase.storage.from("doctor-documents").remove([path]);
    setRow((r) => ({ ...r, documents: r.documents.filter((d) => d.path !== path) }));
  }

  const field = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    extra?: { type?: string; placeholder?: string; required?: boolean },
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={extra?.type ?? "text"}
        placeholder={extra?.placeholder ?? ""}
        required={extra?.required ?? false}
        className="mt-2 h-11 rounded-xl bg-card/80"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> {t("For doctors", "डॉक्टरों के लिए")}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
          {t("Join Apoinmate as a doctor", "डॉक्टर के रूप में Apoinmate से जुड़ें")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t(
            "Create your account, complete your professional profile, upload documents for verification and add a payout method.",
            "अपना खाता बनाएँ, पेशेवर प्रोफ़ाइल पूरी करें, सत्यापन के लिए दस्तावेज़ अपलोड करें और भुगतान विधि जोड़ें।",
          )}
        </p>

        <div className="mt-6">
          <Stepper step={Math.min(step, 3)} />
        </div>

        {!ready && (
          <div className="glass-card mt-6 flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("Loading…", "लोड हो रहा है…")}
          </div>
        )}

        {ready && step === 0 && (
          <div className="glass-card mt-6 p-6">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAccountMode(m)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    accountMode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "signup" ? t("Create account", "खाता बनाएँ") : t("Log in", "लॉग इन")}
                </button>
              ))}
            </div>
            <form className="mt-6 space-y-4" onSubmit={createAccount}>
              {accountMode === "signup" &&
                field("d-name", t("Full name", "पूरा नाम"), accountName, setAccountName, { required: true })}
              {field("d-email", t("Email", "ईमेल"), email, setEmail, { type: "email", required: true })}
              {field("d-pass", t("Password", "पासवर्ड"), password, setPassword, {
                type: "password",
                required: true,
              })}
              <Button type="submit" size="lg" className="h-12 w-full rounded-2xl" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {accountMode === "signup" ? t("Continue", "आगे बढ़ें") : t("Log in", "लॉग इन")}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("Looking for patient login?", "मरीज़ लॉगिन चाहिए?")}{" "}
              <Link to="/auth" search={{ mode: "login" }} className="font-semibold text-primary hover:underline">
                {t("Click here", "यहाँ क्लिक करें")}
              </Link>
            </p>
          </div>
        )}

        {ready && step === 1 && (
          <form
            className="glass-card mt-6 space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              void persist(2);
            }}
          >
            <h2 className="text-lg font-semibold text-navy">{t("Professional profile", "पेशेवर प्रोफ़ाइल")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("f-name", t("Full name", "पूरा नाम"), row.full_name, (v) => set("full_name", v), { required: true })}
              {field("f-phone", t("Mobile number", "मोबाइल नंबर"), row.phone, (v) => set("phone", v), { required: true })}
              <div>
                <Label htmlFor="f-spec">{t("Specialty", "विशेषज्ञता")}</Label>
                <select
                  id="f-spec"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card/80 px-3 text-sm"
                  value={row.specialty}
                  onChange={(e) => set("specialty", e.target.value)}
                >
                  <option value="">{t("Select", "चुनें")}</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {field("f-qual", t("Qualification", "योग्यता"), row.qualification, (v) => set("qualification", v), {
                placeholder: "MBBS, MD",
                required: true,
              })}
              {field(
                "f-exp",
                t("Years of experience", "अनुभव (वर्ष)"),
                row.experience_years?.toString() ?? "",
                (v) => set("experience_years", v ? Number(v) : null),
                { type: "number" },
              )}
              {field("f-reg", t("Registration number", "पंजीकरण संख्या"), row.registration_number, (v) =>
                set("registration_number", v), { required: true })}
              {field("f-council", t("Medical council", "मेडिकल काउंसिल"), row.registration_council, (v) =>
                set("registration_council", v))}
              {field("f-clinic", t("Clinic / hospital name", "क्लीनिक / अस्पताल"), row.clinic_name, (v) =>
                set("clinic_name", v))}
              <div>
                <Label htmlFor="f-city">{t("City", "शहर")}</Label>
                <select
                  id="f-city"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-card/80 px-3 text-sm"
                  value={row.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  {BIHAR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {field("f-area", t("Area / locality", "क्षेत्र"), row.area, (v) => set("area", v))}
              {field(
                "f-fee",
                t("Consultation fee (₹)", "परामर्श शुल्क (₹)"),
                row.consultation_fee?.toString() ?? "",
                (v) => set("consultation_fee", v ? Number(v) : null),
                { type: "number" },
              )}
              {field("f-lang", t("Languages spoken", "भाषाएँ"), row.languages, (v) => set("languages", v))}
            </div>
            <div>
              <Label htmlFor="f-about">{t("About you", "आपके बारे में")}</Label>
              <Textarea
                id="f-about"
                rows={4}
                className="mt-2 rounded-xl bg-card/80"
                value={row.about}
                onChange={(e) => set("about", e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-2xl px-7" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Save and continue", "सहेजें और आगे बढ़ें")}
            </Button>
          </form>
        )}

        {ready && step === 2 && (
          <div className="glass-card mt-6 space-y-5 p-6">
            <h2 className="text-lg font-semibold text-navy">{t("Verification documents", "सत्यापन दस्तावेज़")}</h2>
            <p className="text-sm text-muted-foreground">
              {t(
                "Documents are stored privately and are visible only to you and our verification team.",
                "दस्तावेज़ निजी रूप से संग्रहित होते हैं और केवल आपको व हमारी सत्यापन टीम को दिखते हैं।",
              )}
            </p>
            <div className="grid gap-3">
              {DOC_LABELS.map((d) => (
                <label
                  key={d.key}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-3 text-sm hover:border-primary"
                >
                  <span className="text-navy">{t(d.en, d.hi)}</span>
                  <span className="inline-flex items-center gap-2 text-primary">
                    <FileUp className="h-4 w-4" aria-hidden="true" /> {t("Upload", "अपलोड")}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadDoc(t(d.en, d.hi), f);
                      e.target.value = "";
                    }}
                  />
                </label>
              ))}
            </div>

            {row.documents.length > 0 && (
              <ul className="space-y-2">
                {row.documents.map((d) => (
                  <li
                    key={d.path}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-2.5 text-sm"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-navy">{d.name}</span>
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void removeDoc(d.path)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="h-12 rounded-2xl" onClick={() => setStep(1)}>
                {t("Back", "पीछे")}
              </Button>
              <Button
                className="h-12 rounded-2xl px-7"
                disabled={busy || row.documents.length === 0}
                onClick={() => void persist(3)}
              >
                {t("Save and continue", "सहेजें और आगे बढ़ें")}
              </Button>
            </div>
          </div>
        )}

        {ready && step === 3 && (
          <form
            className="glass-card mt-6 space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              void persist(4, "submitted");
            }}
          >
            <h2 className="text-lg font-semibold text-navy">{t("Payout method", "भुगतान विधि")}</h2>
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1">
              {(["upi", "bank"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set("payout_method", m)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    row.payout_method === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "upi" ? "UPI" : t("Bank account", "बैंक खाता")}
                </button>
              ))}
            </div>

            {row.payout_method === "upi"
              ? field("f-upi", t("UPI ID", "UPI आईडी"), row.payout_upi, (v) => set("payout_upi", v), {
                  placeholder: "name@bank",
                  required: true,
                })
              : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("f-acname", t("Account holder name", "खाताधारक का नाम"), row.payout_account_name, (v) =>
                      set("payout_account_name", v), { required: true })}
                    {field("f-acnum", t("Account number", "खाता संख्या"), row.payout_account_number, (v) =>
                      set("payout_account_number", v), { required: true })}
                    {field("f-ifsc", t("IFSC code", "IFSC कोड"), row.payout_ifsc, (v) => set("payout_ifsc", v), {
                      required: true,
                    })}
                  </div>
                )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={() => setStep(2)}>
                {t("Back", "पीछे")}
              </Button>
              <Button type="submit" className="h-12 rounded-2xl px-7" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("Submit for verification", "सत्यापन के लिए भेजें")}
              </Button>
            </div>
          </form>
        )}

        {ready && step >= 4 && (
          <div className="glass-card mt-6 p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-navy">
              {t("Application submitted", "आवेदन जमा हो गया")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t(
                "Our team reviews doctor applications within 48 hours. You'll get an email once your profile is verified and live.",
                "हमारी टीम 48 घंटों के भीतर डॉक्टर आवेदनों की समीक्षा करती है। प्रोफ़ाइल सत्यापित होते ही आपको ईमेल मिलेगा।",
              )}
            </p>
            <Button className="mt-6 h-12 rounded-2xl px-7" onClick={() => void navigate({ to: "/dashboard/doctor" })}>
              {t("Go to doctor dashboard", "डॉक्टर डैशबोर्ड पर जाएँ")}
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
