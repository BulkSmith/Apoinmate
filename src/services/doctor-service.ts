/** Read/query operations over the doctor catalogue. */
import { DOCTORS } from "@/data/doctors";
import type { Doctor } from "@/types/doctor";

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function listDoctors(): Doctor[] {
  return DOCTORS;
}

export function listDoctorsBySpecialty(specialtySlug: string): Doctor[] {
  return DOCTORS.filter((d) => d.specialtySlug === specialtySlug);
}

export function listFeaturedDoctors(limit = 4): Doctor[] {
  return DOCTORS.filter((d) => d.featured).slice(0, limit);
}

export type DoctorFilters = {
  query?: string;
  city?: string;
  specialtySlug?: string;
  maxFee?: number;
  minExperience?: number;
  minRating?: number;
};

export function filterDoctors(doctors: Doctor[], f: DoctorFilters): Doctor[] {
  const q = f.query?.trim().toLowerCase();
  return doctors.filter((d) => {
    if (f.city && d.city !== f.city) return false;
    if (f.specialtySlug && d.specialtySlug !== f.specialtySlug) return false;
    if (f.maxFee != null && d.fee > f.maxFee) return false;
    if (f.minExperience != null && d.experience < f.minExperience) return false;
    if (f.minRating != null && d.rating < f.minRating) return false;
    if (q) {
      const haystack =
        `${d.name} ${d.specialty} ${d.clinic} ${d.area} ${d.city} ${d.expertise.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export type DoctorSort = "relevance" | "fee-low" | "fee-high" | "rating" | "experience";

export function sortDoctors(doctors: Doctor[], sort: DoctorSort): Doctor[] {
  const list = [...doctors];
  switch (sort) {
    case "fee-low":
      return list.sort((a, b) => a.fee - b.fee);
    case "fee-high":
      return list.sort((a, b) => b.fee - a.fee);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "experience":
      return list.sort((a, b) => b.experience - a.experience);
    default:
      return list;
  }
}
