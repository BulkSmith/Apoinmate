CREATE POLICY "Doctors read own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'doctor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'doctor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors update own documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'doctor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors delete own documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'doctor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);