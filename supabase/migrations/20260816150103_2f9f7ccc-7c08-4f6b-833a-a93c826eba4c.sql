ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id text NOT NULL,
  doctor_name text NOT NULL,
  specialty text,
  clinic text,
  city text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  consultation_type text NOT NULL DEFAULT 'in-clinic',
  fee integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  source text NOT NULL DEFAULT 'web',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own appointments" ON public.appointments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Patients can create own appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Patients can update own appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Patients can delete own appointments" ON public.appointments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.doctor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  specialty text,
  qualification text,
  experience_years integer,
  registration_number text,
  registration_council text,
  clinic_name text,
  city text,
  area text,
  consultation_fee integer,
  languages text,
  about text,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  payout_method text,
  payout_upi text,
  payout_account_name text,
  payout_account_number text,
  payout_ifsc text,
  current_step integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_applications TO authenticated;
GRANT ALL ON public.doctor_applications TO service_role;
ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own application" ON public.doctor_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Doctors can create own application" ON public.doctor_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors can update own application" ON public.doctor_applications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors can delete own application" ON public.doctor_applications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_doctor_applications_updated_at BEFORE UPDATE ON public.doctor_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();