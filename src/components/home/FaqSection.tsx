import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export const FAQS = [
  {
    q: "Is Apoinmate free for patients?",
    a: "Searching doctors, viewing profiles and using Aira is free. When you book an appointment you pay the doctor's consultation fee and a small convenience fee, both shown before payment.",
    qHi: "क्या Apoinmate मरीज़ों के लिए मुफ़्त है?",
    aHi: "डॉक्टर खोजना, प्रोफ़ाइल देखना और Aira का उपयोग मुफ़्त है। अपॉइंटमेंट बुक करते समय आप डॉक्टर की परामर्श फीस और एक छोटा सुविधा शुल्क देते हैं — दोनों भुगतान से पहले दिखाए जाते हैं।",
  },
  {
    q: "How do I know a doctor is genuine?",
    a: "Doctors listed with a Verified badge have submitted qualification and registration details that our team reviews before the profile goes live.",
    qHi: "मुझे कैसे पता चले कि डॉक्टर असली है?",
    aHi: "'सत्यापित' बैज वाले डॉक्टरों ने अपनी योग्यता और पंजीकरण विवरण जमा किए हैं, जिनकी जाँच हमारी टीम प्रोफ़ाइल लाइव होने से पहले करती है।",
  },
  {
    q: "What happens if the doctor is unavailable after I book?",
    a: "You are notified immediately and can reschedule to another slot or request a refund as per our cancellation and refund policy.",
    qHi: "बुकिंग के बाद डॉक्टर उपलब्ध न हों तो क्या होगा?",
    aHi: "आपको तुरंत सूचित किया जाता है और आप दूसरा स्लॉट चुन सकते हैं या हमारी रद्दीकरण व रिफंड नीति के अनुसार रिफंड माँग सकते हैं।",
  },
  {
    q: "Can Aira diagnose my illness?",
    a: "No. Aira helps you understand general health information, choose the right specialty and navigate the platform. It does not diagnose conditions, prescribe medicines or replace a doctor.",
    qHi: "क्या Aira मेरी बीमारी का निदान कर सकती है?",
    aHi: "नहीं। Aira सामान्य स्वास्थ्य जानकारी समझने, सही विशेषज्ञता चुनने और प्लेटफ़ॉर्म चलाने में मदद करती है। यह निदान नहीं करती, दवा नहीं लिखती और डॉक्टर की जगह नहीं लेती।",
  },
  {
    q: "Which cities does Apoinmate cover?",
    a: "We are starting with Muzaffarpur and expanding across Bihar and other growing Indian cities as we onboard verified doctors and clinics.",
    qHi: "Apoinmate किन शहरों में उपलब्ध है?",
    aHi: "हम मुज़फ़्फ़रपुर से शुरुआत कर रहे हैं और सत्यापित डॉक्टरों व क्लीनिकों के जुड़ने के साथ बिहार व अन्य बढ़ते भारतीय शहरों में विस्तार करेंगे।",
  },
  {
    q: "Are online payments safe?",
    a: "Payments are processed through a PCI-compliant payment gateway. Apoinmate never stores your card details.",
    qHi: "क्या ऑनलाइन भुगतान सुरक्षित है?",
    aHi: "भुगतान PCI-अनुपालक पेमेंट गेटवे से होते हैं। Apoinmate आपके कार्ड विवरण कभी संग्रहीत नहीं करता।",
  },
  {
    q: "Can I cancel or reschedule an appointment?",
    a: "Yes. From your dashboard you can reschedule to another available slot, or cancel — refunds follow the timelines in our cancellation and refund policy.",
    qHi: "क्या मैं अपॉइंटमेंट रद्द या बदल सकता हूँ?",
    aHi: "हाँ। अपने डैशबोर्ड से आप दूसरा उपलब्ध स्लॉट चुन सकते हैं या रद्द कर सकते हैं — रिफंड हमारी रद्दीकरण व रिफंड नीति की समय-सीमा के अनुसार होता है।",
  },
  {
    q: "Who can see my prescriptions and medical records?",
    a: "Only you. Records you upload are stored in a private, encrypted bucket and access is restricted to your account. Nothing is shared with a doctor unless you choose to share it.",
    qHi: "मेरे पर्चे और मेडिकल रिकॉर्ड कौन देख सकता है?",
    aHi: "केवल आप। आपके अपलोड किए रिकॉर्ड एक निजी, एन्क्रिप्टेड स्टोरेज में रखे जाते हैं और केवल आपके खाते तक सीमित हैं। जब तक आप न चाहें, कुछ भी डॉक्टर के साथ साझा नहीं होता।",
  },
  {
    q: "Do I need to create an account to book?",
    a: "You can search and compare doctors freely, but an account is required to confirm a booking so we can send reminders and keep your appointment history.",
    qHi: "क्या बुकिंग के लिए खाता बनाना ज़रूरी है?",
    aHi: "आप डॉक्टरों को मुफ़्त में खोज और तुलना कर सकते हैं, लेकिन बुकिंग की पुष्टि के लिए खाता ज़रूरी है ताकि हम रिमाइंडर भेज सकें और आपका अपॉइंटमेंट इतिहास रख सकें।",
  },
  {
    q: "Does Apoinmate offer video consultations?",
    a: "In-clinic appointments are live today. Online consultations and other services will be enabled once we can deliver them reliably in your city.",
    qHi: "क्या Apoinmate वीडियो परामर्श देता है?",
    aHi: "अभी क्लिनिक में अपॉइंटमेंट उपलब्ध हैं। ऑनलाइन परामर्श और अन्य सेवाएं तब शुरू होंगी जब हम उन्हें आपके शहर में भरोसेमंद तरीके से दे सकेंगे।",
  },
  {
    q: "How do reminders work?",
    a: "You get a confirmation as soon as a slot is booked and a reminder before your appointment, so you leave home at the right time.",
    qHi: "रिमाइंडर कैसे काम करते हैं?",
    aHi: "स्लॉट बुक होते ही आपको पुष्टि मिलती है और अपॉइंटमेंट से पहले एक रिमाइंडर, ताकि आप सही समय पर घर से निकलें।",
  },
  {
    q: "How can a doctor or clinic join Apoinmate?",
    a: "Use the For Doctors page to register. After we verify your qualification and registration details, your profile and schedule go live on the platform.",
    qHi: "डॉक्टर या क्लिनिक Apoinmate से कैसे जुड़ सकते हैं?",
    aHi: "'डॉक्टरों के लिए' पेज से पंजीकरण करें। आपकी योग्यता और पंजीकरण विवरण की जाँच के बाद आपकी प्रोफ़ाइल और समय-सारणी प्लेटफ़ॉर्म पर लाइव हो जाती है।",
  },
];

export function FaqSection({ full = false }: { full?: boolean }) {
  const { t } = useLang();
  const items = full ? FAQS : FAQS.slice(0, 4);
  return (
    <Section>
      <SectionHeading
        eyebrow={t("Help", "सहायता")}
        title={t("Frequently asked questions", "अक्सर पूछे जाने वाले प्रश्न")}
      />
      <div className="glass-card mx-auto mt-8 w-full max-w-3xl p-5 sm:p-7">
        <Accordion type="single" collapsible>
          {items.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-navy sm:text-base">
                {t(f.q, f.qHi)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{t(f.a, f.aHi)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {!full && (
          <div className="mt-5 flex justify-center">
            <Button asChild variant="outline" className="h-11 rounded-2xl px-6">
              <Link to="/faq">{t("See more questions", "और प्रश्न देखें")}</Link>
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}
