import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/about")({
  head: () =>
    meta(
      "About Apoinmate — Healthcare Access for Growing Cities",
      "Apoinmate is an Indian health-tech platform making healthcare access faster and simpler for patients in Tier 2, Tier 3 cities and underserved communities.",
    ),
  component: () => (
    <InfoPage
      heading="About Apoinmate"
      headingHi="Apoinmate के बारे में"
      intro="Apoinmate started with a simple observation in Muzaffarpur: patients travel long distances and wait for hours to see a doctor, often without knowing whether the doctor is even available that day. We are building the digital layer that removes that uncertainty."
      introHi="Apoinmate की शुरुआत मुज़फ़्फ़रपुर में एक सीधी-सी बात से हुई: मरीज़ लंबी दूरी तय करते हैं और घंटों इंतज़ार करते हैं, अक्सर यह जाने बिना कि डॉक्टर उस दिन उपलब्ध हैं भी या नहीं। हम वह डिजिटल व्यवस्था बना रहे हैं जो इस अनिश्चितता को दूर करती है।"
      points={[
        "Mission: make healthcare access faster, simpler and more accessible",
        "Focus: Tier 2, Tier 3 cities and underserved communities",
        "Approach: verified providers, real availability, honest fees",
        "AI that assists navigation — never replaces doctors",
        "Careers: we are hiring across engineering, operations and provider partnerships",
        "Blog: notes on healthcare access in smaller Indian cities (coming soon)",
      ]}
      pointsHi={[
        "मिशन: स्वास्थ्य सेवा तक पहुँच को तेज़, आसान और सुलभ बनाना",
        "फ़ोकस: टियर 2, टियर 3 शहर और वंचित समुदाय",
        "तरीका: सत्यापित डॉक्टर, वास्तविक उपलब्धता, ईमानदार फीस",
        "एआई जो रास्ता दिखाता है — डॉक्टर की जगह कभी नहीं लेता",
        "करियर: हम इंजीनियरिंग, ऑपरेशंस और प्रदाता साझेदारी में भर्ती कर रहे हैं",
        "ब्लॉग: छोटे भारतीय शहरों में स्वास्थ्य सेवा पर लेख (जल्द आ रहा है)",
      ]}
      ctaLabel="Get in touch"
      ctaLabelHi="संपर्क करें"
    />
  ),
});
