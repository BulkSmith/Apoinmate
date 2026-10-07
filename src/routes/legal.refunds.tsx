import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/legal/refunds")({
  head: () =>
    meta(
      "Cancellation & Refund Policy | Apoinmate",
      "How appointment cancellations, rescheduling and refunds work on Apoinmate, including timelines and platform fees.",
    ),
  component: () => (
    <LegalPage
      heading="Cancellation & Refund Policy"
      headingHi="रद्दीकरण व रिफंड नीति"
      updated="August 2026"
      sections={[
        {
          title: "Cancelling an appointment",
          titleHi: "अपॉइंटमेंट रद्द करना",
          bodyHi: "आप स्लॉट से 2 घंटे पहले तक मुफ़्त में रद्द कर सकते हैं। परामर्श शुल्क मूल भुगतान माध्यम में वापस किया जाता है।",
          body: "You can cancel free of charge up to 2 hours before your slot. The consultation fee is refunded to the original payment method.",
        },
        {
          title: "Late cancellations and no-shows",
          titleHi: "देर से रद्दीकरण और न आना",
          bodyHi: "स्लॉट से 2 घंटे के भीतर रद्द करने या अपॉइंटमेंट छूटने पर परामर्श शुल्क की वापसी नहीं भी हो सकती है।",
          body: "Cancellations within 2 hours of the slot, or missed appointments, may not be eligible for a refund of the consultation fee.",
        },
        {
          title: "If the doctor is unavailable",
          titleHi: "यदि डॉक्टर उपलब्ध न हों",
          bodyHi: "यदि डॉक्टर रद्द करते हैं या उपलब्ध नहीं हैं, तो आपको प्लेटफ़ॉर्म शुल्क सहित पूरा रिफंड मिलता है, या आप बिना अतिरिक्त शुल्क के समय बदल सकते हैं।",
          body: "If a doctor cancels or is unavailable, you receive a full refund including the platform fee, or you can reschedule at no additional cost.",
        },
        {
          title: "Refund timeline",
          titleHi: "रिफंड की समय-सीमा",
          bodyHi: "स्वीकृत रिफंड 24 घंटे के भीतर शुरू होते हैं और आमतौर पर आपके बैंक के अनुसार 5-7 कार्यदिवसों में खाते में पहुँच जाते हैं।",
          body: "Approved refunds are initiated within 24 hours and typically reach your account within 5-7 working days, depending on your bank.",
        },
      ]}
    />
  ),
});
