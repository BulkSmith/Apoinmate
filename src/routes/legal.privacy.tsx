import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, meta } from "@/components/pages/PageKit";

export const Route = createFileRoute("/legal/privacy")({
  head: () =>
    meta(
      "Privacy Policy | Apoinmate",
      "How Apoinmate collects, stores and protects patient information, medical records and payment data.",
    ),
  component: () => (
    <LegalPage
      heading="Privacy Policy"
      headingHi="गोपनीयता नीति"
      updated="August 2026"
      sections={[
        {
          title: "Information we collect",
          titleHi: "हम कौन-सी जानकारी लेते हैं",
          bodyHi: "खाता बनाते या अपॉइंटमेंट बुक करते समय आप जो विवरण देते हैं — नाम, मोबाइल नंबर, ईमेल, उम्र और अपनी स्वास्थ्य समस्या के बारे में साझा की गई जानकारी — हम वही एकत्र करते हैं।",
          body: "We collect the details you provide when creating an account or booking an appointment — name, mobile number, email, age, and the information you choose to share about your health concern.",
        },
        {
          title: "How medical information is handled",
          titleHi: "चिकित्सा जानकारी कैसे संभाली जाती है",
          bodyHi: "मेडिकल रिकॉर्ड, पर्चे और परामर्श नोट्स केवल आपको और आपके इलाज से जुड़े स्वास्थ्य प्रदाता को दिखते हैं। पहुँच भूमिका-आधारित अनुमतियों से नियंत्रित होती है और हर पहुँच दर्ज की जाती है।",
          body: "Medical records, prescriptions and consultation notes are visible only to you and the healthcare provider involved in your care. Access is controlled by role-based permissions and every access is logged.",
        },
        {
          title: "Payments",
          titleHi: "भुगतान",
          bodyHi: "भुगतान PCI-अनुपालक पेमेंट गेटवे द्वारा होते हैं। Apoinmate आपका कार्ड नंबर, CVV या बैंकिंग विवरण संग्रहीत नहीं करता।",
          body: "Payments are processed by a PCI-compliant payment gateway. Apoinmate does not store your card number, CVV or banking credentials.",
        },
        {
          title: "Your choices",
          titleHi: "आपके विकल्प",
          bodyHi: "आप अपनी प्रोफ़ाइल अपडेट कर सकते हैं, रिकॉर्ड डाउनलोड कर सकते हैं या support@apoinmate.com पर लिखकर खाता हटाने का अनुरोध कर सकते हैं।",
          body: "You can update your profile, download your records or request account deletion by writing to support@apoinmate.com.",
        },
      ]}
    />
  ),
});
