import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { meta } from "@/components/pages/PageKit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () =>
    meta(
      "Contact Apoinmate — Support & Partnerships",
      "Reach the Apoinmate team for patient support, doctor onboarding, clinic partnerships or press enquiries.",
    ),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          Patient support, doctor onboarding or clinic partnerships — tell us what you need and our
          team in Muzaffarpur will get back to you.
        </p>

        <form
          className="glass-card mt-8 grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Thanks! Our team will contact you shortly.");
            (e.target as HTMLFormElement).reset();
          }}
        >
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" required className="mt-2 h-11 rounded-xl bg-card/80" />
          </div>
          <div>
            <Label htmlFor="c-phone">Mobile number</Label>
            <Input id="c-phone" required inputMode="numeric" className="mt-2 h-11 rounded-xl bg-card/80" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="c-email">Email</Label>
            <Input id="c-email" type="email" required className="mt-2 h-11 rounded-xl bg-card/80" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="c-msg">How can we help?</Label>
            <Textarea id="c-msg" required className="mt-2 rounded-xl bg-card/80" rows={5} />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-2xl sm:col-span-2">
            Send message
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          support@apoinmate.com · +91 9065407472 · Muzaffarpur, Bihar
        </p>
      </div>
    </SiteLayout>
  );
}
