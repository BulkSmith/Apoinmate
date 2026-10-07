import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FinalCta, ServicesSection } from "@/components/home/sections";

const title = "Healthcare Services | Apoinmate";
const description =
  "Doctor appointments today, with home healthcare, diagnostics, ambulance, medicines, mental healthcare and preventive checkups coming soon on Apoinmate.";

export const Route = createFileRoute("/services")({
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
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Healthcare services</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Apoinmate is building a complete healthcare access layer for smaller cities. We launch
          each service only when it can be delivered reliably — everything else is clearly marked
          coming soon.
        </p>
      </div>
      <ServicesSection />
      <FinalCta />
    </SiteLayout>
  ),
});
