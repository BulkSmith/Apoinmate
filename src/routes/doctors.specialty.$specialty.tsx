import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { getSpecialty } from "@/data/specialties";

export const Route = createFileRoute("/doctors/specialty/$specialty")({
  loader: ({ params }) => {
    const specialty = getSpecialty(params.specialty);
    if (!specialty) throw notFound();
    return { specialty };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.specialty;
    const title = s ? `${s.name} Doctors in Bihar | Apoinmate` : "Doctors | Apoinmate";
    const description = s
      ? `Find verified ${s.name.toLowerCase()}s near you. ${s.description} Compare fees, experience and availability, then book an appointment on Apoinmate.`
      : "Find verified doctors by specialty on Apoinmate.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Specialty not found</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Browse all doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Something went wrong</h1>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/find-doctors">Browse all doctors</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: SpecialtyPage,
});

function SpecialtyPage() {
  const { specialty } = Route.useLoaderData();
  const doctors = DOCTORS.filter((d) => d.specialtySlug === specialty.slug);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{specialty.name}s near you</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{specialty.description}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctors.length ? (
            doctors.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)
          ) : (
            <div className="glass-card p-8 md:col-span-2 xl:col-span-3">
              <p className="font-semibold text-navy">
                We are onboarding verified {specialty.name.toLowerCase()}s in your area.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Meanwhile, a general physician can guide you to the right specialist.
              </p>
              <Button asChild className="mt-5 rounded-xl">
                <Link to="/find-doctors">See available doctors</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
