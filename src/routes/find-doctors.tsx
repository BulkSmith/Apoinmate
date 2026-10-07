import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SearchBar } from "@/components/search/SearchBar";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCTORS } from "@/data/doctors";
import { SPECIALTIES } from "@/data/specialties";
import { DEFAULT_CITY } from "@/data/locations";

const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  specialty: z.string().optional(),
});

const title = "Find Doctors Near You | Apoinmate";
const description =
  "Search verified doctors by specialty, location, fees, experience and availability. Compare profiles and book an in-clinic appointment on Apoinmate.";

export const Route = createFileRoute("/find-doctors")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindDoctors,
});

export function DoctorResults({
  presetSpecialty,
  presetCity,
  heading,
  intro,
}: {
  presetSpecialty?: string;
  presetCity?: string;
  heading?: string;
  intro?: string;
}) {
  const search = Route.useSearch?.() ?? {};
  const q = (search as { q?: string }).q ?? "";
  const city = presetCity ?? (search as { city?: string }).city ?? "";

  const [specialty, setSpecialty] = useState(presetSpecialty ?? "all");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [maxFee, setMaxFee] = useState(1000);
  const [minExp, setMinExp] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = DOCTORS.filter((d) => {
      if (city && d.city.toLowerCase() !== city.toLowerCase()) return false;
      if (specialty !== "all" && d.specialtySlug !== specialty) return false;
      if (gender !== "all" && d.gender !== gender) return false;
      if (d.fee > maxFee) return false;
      if (d.experience < minExp) return false;
      if (d.rating < minRating) return false;
      if (verifiedOnly && !d.verified) return false;
      if (needle) {
        const hay =
          `${d.name} ${d.specialty} ${d.clinic} ${d.city} ${d.area} ${d.expertise.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "fee":
          return a.fee - b.fee;
        case "experience":
          return b.experience - a.experience;
        case "earliest":
          return a.nextAvailable.startsWith("Today") === b.nextAvailable.startsWith("Today")
            ? 0
            : a.nextAvailable.startsWith("Today")
              ? -1
              : 1;
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
    return list;
  }, [q, city, specialty, gender, sort, maxFee, minExp, minRating, verifiedOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-navy sm:text-4xl">
        {heading ?? (city ? `Doctors in ${city}` : "Find doctors")}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {intro ??
          "Compare verified doctors by experience, fees, ratings and real availability — then book a slot that fits your day."}
      </p>

      <SearchBar className="mt-6" initialQuery={q} initialCity={city || DEFAULT_CITY} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside
          className={`glass-card h-fit p-5 lg:block ${showFilters ? "block" : "hidden"}`}
          aria-label="Filters"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Filters
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <Label className="text-sm text-navy">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="mt-2 rounded-xl bg-card/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">All specialties</SelectItem>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-navy">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="mt-2 rounded-xl bg-card/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-navy">Maximum fee: ₹{maxFee}</Label>
              <Slider
                className="mt-3"
                value={[maxFee]}
                min={200}
                max={1000}
                step={50}
                onValueChange={(v) => setMaxFee(v[0] ?? 1000)}
              />
            </div>

            <div>
              <Label className="text-sm text-navy">Minimum experience: {minExp} yrs</Label>
              <Slider
                className="mt-3"
                value={[minExp]}
                min={0}
                max={20}
                step={1}
                onValueChange={(v) => setMinExp(v[0] ?? 0)}
              />
            </div>

            <div>
              <Label className="text-sm text-navy">Minimum rating: {minRating.toFixed(1)}</Label>
              <Slider
                className="mt-3"
                value={[minRating]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={(v) => setMinRating(v[0] ?? 0)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="verified"
                checked={verifiedOnly}
                onCheckedChange={(v) => setVerifiedOnly(Boolean(v))}
              />
              <Label htmlFor="verified" className="text-sm text-navy">
                Verified doctors only
              </Label>
            </div>

            <div className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
              Consultation type: In-clinic (online consultation coming soon)
            </div>
          </div>
        </aside>

        <div>
          <div className="glass mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <p className="text-sm text-navy">
              <strong>{results.length}</strong> doctors found
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl bg-card/70 lg:hidden"
                onClick={() => setShowFilters((s) => !s)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-52 rounded-xl bg-card/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="earliest">Earliest available</SelectItem>
                  <SelectItem value="fee">Lowest consultation fee</SelectItem>
                  <SelectItem value="experience">Most experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-lg font-semibold text-navy">No doctors match these filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your fee range or clearing the specialty filter. We are onboarding new
                verified doctors every week.
              </p>
              <Button asChild className="mt-5 rounded-xl">
                <Link to="/ai-assistant">Ask Aira for help</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((d, i) => (
                <DoctorCard key={d.id} doctor={d} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FindDoctors() {
  return (
    <SiteLayout>
      <DoctorResults />
    </SiteLayout>
  );
}
