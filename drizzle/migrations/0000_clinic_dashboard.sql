ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS patient_name text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE POLICY "Doctors can view their appointments" ON public.appointments
  FOR SELECT TO authenticated USING (doctor_id = auth.uid()::text);
CREATE POLICY "Doctors can update their appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (doctor_id = auth.uid()::text) WITH CHECK (doctor_id = auth.uid()::text);

CREATE TABLE public.doctor_listings (
  id text PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  specialty text,
  qualification text,
  experience_years integer,
  clinic text,
  city text,
  area text,
  fee integer NOT NULL DEFAULT 0,
  languages text,
  about text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctor_listings TO anon, authenticated;
GRANT UPDATE ON public.doctor_listings TO authenticated;
GRANT ALL ON public.doctor_listings TO service_role;
ALTER TABLE public.doctor_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active listings" ON public.doctor_listings FOR SELECT TO anon, authenticated USING (is_active OR auth.uid() = user_id);
CREATE POLICY "Doctors update own listing" ON public.doctor_listings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_doctor_listings_updated_at BEFORE UPDATE ON public.doctor_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.sync_doctor_listing()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'verified' THEN
    INSERT INTO public.doctor_listings (id, user_id, name, specialty, qualification, experience_years, clinic, city, area, fee, languages, about, is_active)
    VALUES (NEW.user_id::text, NEW.user_id, COALESCE(NEW.full_name, 'Doctor'), NEW.specialty, NEW.qualification, NEW.experience_years, NEW.clinic_name, COALESCE(NEW.city, 'Muzaffarpur'), NEW.area, COALESCE(NEW.consultation_fee, 0), NEW.languages, NEW.about, true)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, specialty = EXCLUDED.specialty, qualification = EXCLUDED.qualification,
      experience_years = EXCLUDED.experience_years, clinic = EXCLUDED.clinic, city = EXCLUDED.city, area = EXCLUDED.area,
      fee = EXCLUDED.fee, languages = EXCLUDED.languages, about = EXCLUDED.about, is_active = true;
  ELSE
    UPDATE public.doctor_listings SET is_active = false WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER sync_doctor_listing_trg AFTER INSERT OR UPDATE OF status ON public.doctor_applications FOR EACH ROW EXECUTE FUNCTION public.sync_doctor_listing();

CREATE TABLE public.doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  weekday smallint NOT NULL,
  start_time text NOT NULL DEFAULT '10:00',
  end_time text NOT NULL DEFAULT '18:00',
  slot_minutes integer NOT NULL DEFAULT 15,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, weekday)
);
GRANT SELECT ON public.doctor_schedules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_schedules TO authenticated;
GRANT ALL ON public.doctor_schedules TO service_role;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view schedules" ON public.doctor_schedules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Doctors manage own schedule" ON public.doctor_schedules FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);