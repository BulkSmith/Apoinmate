/** Patient / profile domain types. */

export type PatientProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  city: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  emergency_contact: string | null;
  onboarding_complete: boolean;
};
