CREATE POLICY "Doctors can view appointments assigned to them" ON public.appointments
  FOR SELECT TO authenticated
  USING (doctor_id = auth.uid()::text);

CREATE POLICY "Doctors can update appointments assigned to them" ON public.appointments
  FOR UPDATE TO authenticated
  USING (doctor_id = auth.uid()::text)
  WITH CHECK (doctor_id = auth.uid()::text);
