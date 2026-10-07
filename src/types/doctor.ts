/** Doctor domain types. */

export type Gender = "Male" | "Female";

export type Doctor = {
  id: string;
  name: string;
  gender: Gender;
  specialtySlug: string;
  specialty: string;
  qualification: string;
  experience: number;
  clinic: string;
  city: string;
  area: string;
  fee: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  nextAvailable: string;
  languages: string[];
  about: string;
  expertise: string[];
  featured?: boolean;
};

export type SlotPeriod = "Morning" | "Afternoon" | "Evening";
