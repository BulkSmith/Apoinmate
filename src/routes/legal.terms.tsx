import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/legal/terms")({
  head: () =>
    meta(
      "Terms & Conditions | Apoinmate",
      "The terms that govern the use of Apoinmate's appointment booking platform by patients, doctors and clinics.",
    ),
  component: () => (
    <LegalPage
      heading="Terms & Conditions"
      headingHi="नियम व शर्तें"
      updated="August 2026"
      sections={[
        {
          title: "About the platform",
          titleHi: "प्लेटफ़ॉर्म के बारे में",
          bodyHi: "Apoinmate एक तकनीकी प्लेटफ़ॉर्म है जो मरीज़ों को स्वास्थ्य प्रदाता खोजने और अपॉइंटमेंट बुक करने में मदद करता है। Apoinmate चिकित्सा सलाह, निदान या इलाज नहीं देता और यह आपातकालीन सेवा नहीं है।",
          body: "Apoinmate is a technology platform that helps patients discover healthcare providers and book appointments. Apoinmate does not provide medical advice, diagnosis or treatment, and is not an emergency service.",
        },
        {
          title: "Provider responsibility",
          titleHi: "प्रदाता की ज़िम्मेदारी",
          bodyHi: "परामर्श, चिकित्सा निर्णय और इलाज पूरी तरह आपके चुने गए डॉक्टर या क्लिनिक की ज़िम्मेदारी है। सत्यापन जमा किए गए योग्यता दस्तावेज़ों की पुष्टि करता है; यह इलाज के परिणाम की गारंटी नहीं है।",
          body: "Consultations, medical decisions and treatment are the sole responsibility of the doctor or clinic you choose. Verification confirms submitted qualification documents; it is not a guarantee of clinical outcome.",
        },
        {
          title: "Bookings",
          titleHi: "बुकिंग",
          bodyHi: "अपॉइंटमेंट सफल भुगतान के बाद ही पक्का होता है। क्लिनिक में आपात स्थिति के कारण स्लॉट का समय थोड़ा बदल सकता है।",
          body: "An appointment is confirmed only after successful payment. Slot timings are best-effort and may shift due to clinical emergencies at the clinic.",
        },
        {
          title: "Acceptable use",
          titleHi: "स्वीकार्य उपयोग",
          bodyHi: "आप सही जानकारी देने और प्लेटफ़ॉर्म, अन्य उपयोगकर्ताओं के डेटा या एआई सहायक का दुरुपयोग न करने के लिए सहमत हैं।",
          body: "You agree to provide accurate information and not to misuse the platform, other users' data or the AI assistant.",
        },
      ]}
    />
  ),
});
