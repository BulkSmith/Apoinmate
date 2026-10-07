/** Medical record domain types. */

export const RECORD_TYPES = ["prescription", "report", "lab", "invoice", "other"] as const;

export type RecordType = (typeof RECORD_TYPES)[number];

export type MedicalRecord = {
  id: string;
  title: string;
  record_type: RecordType;
  doctor_name: string | null;
  record_date: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
};

export type NewMedicalRecord = {
  title: string;
  recordType: RecordType;
  doctorName: string;
  recordDate: string;
  file: File;
};
