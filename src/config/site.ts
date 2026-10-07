/** Static, environment-independent application configuration. */

export const SITE = {
  name: "Apoinmate",
  legalName: "ApoinMate TeleMed Inc.",
  tagline: "Healthcare appointments, made simple.",
  supportEmail: "support@apoinmate.com",
  supportPhone: "+91 9065407472",
  defaultCity: "Muzaffarpur",
} as const;

export const LIMITS = {
  /** Maximum upload size for a medical record file. */
  recordMaxBytes: 10 * 1024 * 1024,
  /** Signed URL lifetime for viewing a record, in seconds. */
  viewUrlTtl: 60,
  /** Signed URL lifetime for downloading a record, in seconds. */
  downloadUrlTtl: 300,
} as const;

export const STORAGE_BUCKETS = {
  medicalRecords: "medical-records",
  avatars: "avatars",
  doctorDocuments: "doctor-documents",
} as const;
