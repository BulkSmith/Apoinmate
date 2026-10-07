import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  Clock,
  GraduationCap,
  IndianRupee,
  Languages,
  MapPin,
  Star,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DoctorAvatar } from "@/components/doctors/DoctorAvatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDoctor, TIME_SLOTS } from "@/data/doctors";

export const Route = createFileRoute("/doctors/$doctorId")({
  loader: ({ params }) => {
    const doctor = getDoctor(params.doctorId);
    if (!doctor) throw notFound();
    return { doctor };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.doctor;
    const title = d
      ? `${d.name} — ${d.specialty} in ${d.city} | Apoinmate`
      : "Doctor profile | Apoinmate";
    const description = d
      ? `Book an appointment with ${d.name}, ${d.specialty} (${d.experience} years experience) at ${d.clinic}, ${d.city}. Consultation fee ₹${d.fee}.`
      : "View verified doctor profiles and book appointments on Apoinmate.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">We couldn&apos;t load this profile</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Back to doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Doctor not found</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Browse doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: DoctorProfile,
});

const REVIEWS = [
  {
    name: "Amit Kumar",
    rating: 5,
    text: "Explained my reports patiently and did not rush the consultation. Slot timing was accurate.",
    when: "2 weeks ago",
  },
  {
    name: "Pooja Singh",
    rating: 5,
    text: "Booked in the evening slot and was called within 10 minutes of reaching the clinic.",
    when: "1 month ago",
  },
  {
    name: "Ravi Ranjan",
    rating: 4,
    text: "Good consultation. The clinic was a little crowded but the appointment system helped.",
    when: "2 months ago",
  },
];

function DoctorProfile() {
  const { doctor } = Route.useLoaderData();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="glass-card p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <DoctorAvatar name={doctor.name} className="h-24 w-24 text-2xl" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-navy sm:text-3xl">{doctor.name}</h1>
                    {doctor.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
                        <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-medium text-primary">{doctor.specialty}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" /> {doctor.qualification}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {doctor.experience} years of experience
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-navy">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
                      {doctor.rating} · {doctor.reviewCount} reviews
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-semibold text-navy">
                      <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                      {doctor.fee} consultation
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 font-semibold text-success">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {doctor.nextAvailable}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-lg font-semibold text-navy">About</h2>
              <p className="mt-2 text-sm text-muted-foreground">{doctor.about}</p>

              <h2 className="mt-6 text-lg font-semibold text-navy">Areas of expertise</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {doctor.expertise.map((e: string) => (
                  <li
                    key={e}
                    className="rounded-full bg-card px-3 py-1.5 text-sm text-navy ring-1 ring-border"
                  >
                    {e}
                  </li>
                ))}
              </ul>

              <h2 className="mt-6 text-lg font-semibold text-navy">Languages</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Languages className="h-4 w-4" aria-hidden="true" />
                {doctor.languages.join(", ")}
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-navy">Clinic information</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-navy">
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" /> {doctor.clinic}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> {doctor.area},{" "}
                {doctor.city}, Bihar
              </p>
              <p className="mt-4 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                In-clinic consultation only. Please carry previous prescriptions and reports.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-navy">Patient reviews</h2>
              <div className="mt-4 space-y-4">
                {REVIEWS.map((r) => (
                  <article key={r.name} className="rounded-2xl bg-card/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-navy">{r.name}</p>
                      <span className="text-xs text-muted-foreground">{r.when}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5" aria-label={`${r.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-navy">Book appointment</h2>
              <div className="mt-3 rounded-2xl bg-primary-soft p-3 text-sm font-medium text-navy">
                In-clinic consultation · ₹{doctor.fee}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Available today
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...TIME_SLOTS.Afternoon.slice(0, 3), ...TIME_SLOTS.Evening.slice(0, 3)].map(
                  (t) => (
                    <Link
                      key={t}
                      to="/book/$doctorId"
                      params={{ doctorId: doctor.id }}
                      className="rounded-xl bg-card px-3 py-2 text-sm text-navy ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {t}
                    </Link>
                  ),
                )}
              </div>
              <Button asChild size="lg" className="mt-6 h-12 w-full rounded-2xl text-base">
                <Link to="/book/$doctorId" params={{ doctorId: doctor.id }}>
                  Book Appointment
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free cancellation up to 2 hours before your slot.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
