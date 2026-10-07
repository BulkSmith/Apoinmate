import { useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { signedAvatarUrl, uploadAvatar } from "@/lib/avatar";
import { initialsOf, type PatientProfile } from "@/hooks/useAuthUser";
import { useLang } from "@/lib/i18n";
import { BIHAR_CITIES } from "@/data/locations";

export function ProfileSettings({
  userId,
  email,
  profile,
  onSaved,
}: {
  userId: string;
  email?: string | undefined;
  profile: PatientProfile | null;
  onSaved?: (p: PatientProfile) => void;
}) {
  const { t } = useLang();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "Muzaffarpur",
    gender: profile?.gender ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    blood_group: profile?.blood_group ?? "",
    emergency_contact: profile?.emergency_contact ?? "",
  });
  const [avatarPath, setAvatarPath] = useState(profile?.avatar_url ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void signedAvatarUrl(avatarPath).then(setPreview);
  }, [avatarPath]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadAvatar(userId, file);
      await supabase.from("profiles").update({ avatar_url: path }).eq("id", userId);
      setAvatarPath(path);
      toast.success(t("Profile picture updated", "प्रोफ़ाइल फोटो अपडेट हुई"));
    } catch {
      toast.error(t("Could not upload picture", "फोटो अपलोड नहीं हो सकी"));
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        id: userId,
        ...form,
        date_of_birth: form.date_of_birth || null,
        onboarding_complete: true,
      };
      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload)
        .select("*")
        .single();
      if (error) throw error;
      toast.success(t("Profile saved", "प्रोफ़ाइल सहेजी गई"));
      onSaved?.(data as PatientProfile);
    } catch {
      toast.error(t("Could not save profile", "प्रोफ़ाइल सहेजी नहीं जा सकी"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="glass-card p-6">
      <h2 className="text-lg font-semibold text-navy">{t("Profile settings", "प्रोफ़ाइल सेटिंग")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(
          "Keep your details up to date so clinics can reach you.",
          "अपनी जानकारी अपडेट रखें ताकि क्लीनिक आपसे संपर्क कर सकें।",
        )}
      </p>

      <div className="mt-6 flex items-center gap-4">
        {preview ? (
          <img src={preview} alt="" className="h-20 w-20 rounded-3xl object-cover" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft text-xl font-bold text-primary">
            {initialsOf(form.full_name || email)}
          </span>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2 text-sm font-medium text-navy hover:border-primary">
          <Camera className="h-4 w-4" aria-hidden="true" />
          {t("Change photo", "फोटो बदलें")}
          <input type="file" accept="image/*" className="hidden" onChange={pickAvatar} />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">{t("Full name", "पूरा नाम")}</Label>
          <Input id="p-name" className="mt-2 h-11 rounded-xl bg-card/80" value={form.full_name} onChange={set("full_name")} required />
        </div>
        <div>
          <Label htmlFor="p-phone">{t("Mobile number", "मोबाइल नंबर")}</Label>
          <Input id="p-phone" inputMode="numeric" className="mt-2 h-11 rounded-xl bg-card/80" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <Label htmlFor="p-city">{t("City", "शहर")}</Label>
          <select
            id="p-city"
            className="mt-2 h-11 w-full rounded-xl border border-input bg-card/80 px-3 text-sm"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          >
            {BIHAR_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="p-gender">{t("Gender", "लिंग")}</Label>
          <select
            id="p-gender"
            className="mt-2 h-11 w-full rounded-xl border border-input bg-card/80 px-3 text-sm"
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          >
            <option value="">{t("Select", "चुनें")}</option>
            <option value="Female">{t("Female", "महिला")}</option>
            <option value="Male">{t("Male", "पुरुष")}</option>
            <option value="Other">{t("Other", "अन्य")}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="p-dob">{t("Date of birth", "जन्म तिथि")}</Label>
          <Input id="p-dob" type="date" className="mt-2 h-11 rounded-xl bg-card/80" value={form.date_of_birth} onChange={set("date_of_birth")} />
        </div>
        <div>
          <Label htmlFor="p-blood">{t("Blood group", "ब्लड ग्रुप")}</Label>
          <Input id="p-blood" className="mt-2 h-11 rounded-xl bg-card/80" value={form.blood_group} onChange={set("blood_group")} placeholder="O+" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-emg">{t("Emergency contact", "आपातकालीन संपर्क")}</Label>
          <Input id="p-emg" className="mt-2 h-11 rounded-xl bg-card/80" value={form.emergency_contact} onChange={set("emergency_contact")} />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 h-12 rounded-2xl px-7" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("Save profile", "प्रोफ़ाइल सहेजें")}
      </Button>
    </form>
  );
}
