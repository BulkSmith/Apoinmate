import { MapPin, Quote } from "lucide-react";
import storyRekha from "@/assets/stories/rekha.jpg";
import storyAmit from "@/assets/stories/amit.jpg";
import storyRamesh from "@/assets/stories/ramesh.jpg";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export const TESTIMONIALS = [
  {
    name: "Rekha Devi",
    place: "Brahmpura, Muzaffarpur",
    photo: storyRekha,
    text: "We used to wait hours outside the clinic for my mother's check-up. Now we confirm the doctor is available before leaving home. That alone saves us a full day.",
    textHi: "माँ की जाँच के लिए हम घंटों क्लिनिक के बाहर इंतज़ार करते थे। अब घर से निकलने से पहले ही डॉक्टर की उपलब्धता पक्की कर लेते हैं। इससे पूरा दिन बच जाता है।",
  },
  {
    name: "Amit Kumar",
    place: "Juran Chhapra, Muzaffarpur",
    photo: storyAmit,
    text: "I booked a 5:30 PM slot after work and was seen within ten minutes. No more taking half a day off just to see a doctor.",
    textHi: "मैंने ऑफ़िस के बाद शाम 5:30 का स्लॉट बुक किया और दस मिनट में डॉक्टर से मिल गया। अब डॉक्टर के लिए आधे दिन की छुट्टी नहीं लेनी पड़ती।",
  },
  {
    name: "Ramesh Prasad",
    place: "Sikandarpur, Muzaffarpur",
    photo: storyRamesh,
    text: "My grandson booked my heart check-up on his phone. The fee was clear upfront and the clinic called my name right on time.",
    textHi: "मेरे पोते ने फ़ोन से मेरी हृदय जाँच बुक की। फीस पहले से साफ़ थी और क्लिनिक ने ठीक समय पर मेरा नाम बुलाया।",
  },
];

export function Testimonials() {
  const { t } = useLang();
  return (
    <Section>
      <SectionHeading
        eyebrow={t("Real experiences", "वास्तविक अनुभव")}
        title={t("Time saved, care received.", "समय बचा, इलाज मिला।")}
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((s) => (
          <figure key={s.name} className="glass-card flex flex-col overflow-hidden">
            <div className="relative">
              <img src={s.photo} alt={s.name} loading="lazy" width={816} height={816} className="h-56 w-full object-cover" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {s.place}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <Quote className="h-6 w-6 text-primary/50" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-sm text-navy">{t(s.text, s.textHi)}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy">{s.name}</figcaption>
            </div>
          </figure>
        ))}
      </div>
    </Section>
  );
}
