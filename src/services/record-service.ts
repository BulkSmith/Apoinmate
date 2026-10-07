/** Secure medical-record storage operations. */
import { supabase } from "@/integrations/supabase/client";
import { LIMITS, STORAGE_BUCKETS } from "@/config/site";
import type { MedicalRecord, NewMedicalRecord } from "@/types/record";

const BUCKET = STORAGE_BUCKETS.medicalRecords;

export async function listRecords(): Promise<MedicalRecord[]> {
  const { data, error } = await supabase
    .from("medical_records")
    .select("id,title,record_type,doctor_name,record_date,file_path,file_name,size_bytes")
    .order("record_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MedicalRecord[];
}

export async function uploadRecord(userId: string, input: NewMedicalRecord) {
  const { file } = input;
  if (file.size > LIMITS.recordMaxBytes) {
    throw new Error("File is too large (max 10 MB)");
  }
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${userId}/${crypto.randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "application/octet-stream" });
  if (upErr) throw upErr;

  const { error: insErr } = await supabase.from("medical_records").insert({
    user_id: userId,
    title: input.title.trim() || safeName,
    record_type: input.recordType,
    doctor_name: input.doctorName.trim() || null,
    record_date: input.recordDate,
    file_path: path,
    file_name: file.name,
    mime_type: file.type || null,
    size_bytes: file.size,
  });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw insErr;
  }
}

/** Time-limited URL for opening a record in a new tab. */
export async function getViewUrl(record: MedicalRecord): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(record.file_path, LIMITS.viewUrlTtl);
  if (error || !data) throw error ?? new Error("Could not open this file");
  return data.signedUrl;
}

/** Time-limited URL that forces a file download. */
export async function getDownloadUrl(record: MedicalRecord): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(record.file_path, LIMITS.downloadUrlTtl, { download: record.file_name });
  if (error || !data) throw error ?? new Error("Could not prepare the download link");
  return data.signedUrl;
}

export async function deleteRecord(record: MedicalRecord) {
  const { error } = await supabase.from("medical_records").delete().eq("id", record.id);
  if (error) throw error;
  await supabase.storage.from(BUCKET).remove([record.file_path]);
}
