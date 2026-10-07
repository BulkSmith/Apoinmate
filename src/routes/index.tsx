import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  AiraSection,
  FaqSection,
  FinalCta,
  Hero,
  HowItWorks,
  ProvidersSection,
  ServicesSection,
  SpecialtiesSection,
  Testimonials,
} from "@/components/home/sections";

const title = "Apoinmate — AI-Powered Healthcare & Doctor Appointments";
const description =
  "Find trusted doctors, book appointments and access online healthcare with Apoinmate. Built to make healthcare faster and more accessible across India.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <HowItWorks />
      <SpecialtiesSection />
      <AiraSection />
      <ServicesSection />
      <ProvidersSection />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </SiteLayout>
  );
}
