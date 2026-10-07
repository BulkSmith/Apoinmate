import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Doctor } from "@/types/doctor";

type ListingRow = Database["public"]["Tables"]["doctor_listings"]["Row"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Maps a verified doctor's listing to the public Doctor shape. */
export function listingToDoctor(r: ListingRow): Doctor {
  const specialty = r.specialty ?? "General Physician";
  return {
    id: r.id,
    name: r.name,
    gender: "Male",
    specialtySlug: specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    specialty,
    qualification: r.qualification ?? "",
    experience: r.experience_years ?? 0,
    clinic: r.clinic ?? "Clinic",
    city: r.city ?? "Muzaffarpur",
    area: r.area ?? "",
    fee: r.fee,
    rating: 0,
    reviewCount: 0,
    verified: true,
    nextAvailable: "Today",
    languages: (r.languages ?? "Hindi, English").split(",").map((s) => s.trim()).filter(Boolean),
    about: r.about ?? "",
    expertise: [],
  };
}

export const getListedDoctor = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row } = await publicClient()
      .from("doctor_listings")
      .select("*")
      .eq("id", data.id)
      .eq("is_active", true)
      .maybeSingle();
    return row ? listingToDoctor(row) : null;
  });

export const listListedDoctors = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("doctor_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(listingToDoctor);
});
