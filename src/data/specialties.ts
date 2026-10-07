import cardiology from "@/assets/specialties/cardiology.jpg";
import dentistry from "@/assets/specialties/dentistry.jpg";
import dermatology from "@/assets/specialties/dermatology.jpg";
import diabetology from "@/assets/specialties/diabetology.jpg";
import emergency from "@/assets/specialties/emergency.jpg";
import ent from "@/assets/specialties/ent.jpg";
import gastroenterology from "@/assets/specialties/gastroenterology.jpg";
import generalPhysician from "@/assets/specialties/general-physician.jpg";
import gynecology from "@/assets/specialties/gynecology.jpg";
import nephrology from "@/assets/specialties/nephrology.jpg";
import neurology from "@/assets/specialties/neurology.jpg";
import ophthalmology from "@/assets/specialties/ophthalmology.jpg";
import orthopedics from "@/assets/specialties/orthopedics.jpg";
import pediatrics from "@/assets/specialties/pediatrics.jpg";
import psychiatry from "@/assets/specialties/psychiatry.jpg";
import pulmonology from "@/assets/specialties/pulmonology.jpg";

import type { Specialty } from "@/types/specialty";

export type { Specialty };

export const SPECIALTIES: Specialty[] = [
  {
    slug: "general-physician",
    name: "General Physician",
    nameHi: "जनरल फिजिशियन",
    description: "Fever, infections, everyday health concerns and routine check-ups.",
    icon: "Stethoscope",
    image: generalPhysician,
  },
  {
    slug: "cardiologist",
    name: "Cardiologist",
    nameHi: "हृदय रोग विशेषज्ञ",
    description: "Heart health, blood pressure, chest pain and cardiac follow-ups.",
    icon: "HeartPulse",
    image: cardiology,
  },
  {
    slug: "dermatologist",
    name: "Dermatologist",
    nameHi: "त्वचा रोग विशेषज्ञ",
    description: "Skin, hair and nail conditions, allergies and cosmetic concerns.",
    icon: "Sparkles",
    image: dermatology,
  },
  {
    slug: "pediatrician",
    name: "Pediatrician",
    nameHi: "बाल रोग विशेषज्ञ",
    description: "Child health, vaccinations, growth and newborn care.",
    icon: "Baby",
    image: pediatrics,
  },
  {
    slug: "gynecologist",
    name: "Gynecologist",
    nameHi: "स्त्री रोग विशेषज्ञ",
    description: "Women's health, pregnancy care and menstrual concerns.",
    icon: "Flower2",
    image: gynecology,
  },
  {
    slug: "orthopedic",
    name: "Orthopedic Surgeon",
    nameHi: "हड्डी रोग विशेषज्ञ",
    description: "Bone, joint, spine injuries and mobility problems.",
    icon: "Bone",
    image: orthopedics,
  },
  {
    slug: "ent-specialist",
    name: "ENT Specialist",
    nameHi: "कान, नाक व गला विशेषज्ञ",
    description: "Ear, nose and throat conditions, sinus and hearing issues.",
    icon: "Ear",
    image: ent,
  },
  {
    slug: "neurologist",
    name: "Neurologist",
    nameHi: "न्यूरोलॉजिस्ट",
    description: "Headaches, seizures, stroke care and nerve disorders.",
    icon: "Brain",
    image: neurology,
  },
  {
    slug: "dentist",
    name: "Dentist",
    nameHi: "दंत चिकित्सक",
    description: "Dental pain, cavities, cleaning and oral health.",
    icon: "Smile",
    image: dentistry,
  },
  {
    slug: "ophthalmologist",
    name: "Eye Specialist",
    nameHi: "नेत्र रोग विशेषज्ञ",
    description: "Vision problems, cataract, eye infections and eye check-ups.",
    icon: "Eye",
    image: ophthalmology,
  },
  {
    slug: "psychiatrist",
    name: "Psychiatrist",
    nameHi: "मनोचिकित्सक",
    description: "Anxiety, depression, sleep problems and mental wellbeing.",
    icon: "HeartHandshake",
    image: psychiatry,
  },
  {
    slug: "diabetologist",
    name: "Diabetologist",
    nameHi: "मधुमेह विशेषज्ञ",
    description: "Diabetes management, thyroid and metabolic health.",
    icon: "Droplets",
    image: diabetology,
  },
  {
    slug: "pulmonologist",
    name: "Pulmonologist",
    nameHi: "फेफड़ा रोग विशेषज्ञ",
    description: "Asthma, chronic cough, breathlessness and lung infections.",
    icon: "Wind",
    image: pulmonology,
  },
  {
    slug: "nephrologist",
    name: "Nephrologist",
    nameHi: "गुर्दा रोग विशेषज्ञ",
    description: "Kidney disease, dialysis guidance and urinary problems.",
    icon: "Droplet",
    image: nephrology,
  },
  {
    slug: "gastroenterologist",
    name: "Gastroenterologist",
    nameHi: "पेट रोग विशेषज्ञ",
    description: "Acidity, liver problems, digestion and abdominal pain.",
    icon: "Soup",
    image: gastroenterology,
  },
  {
    slug: "emergency-care",
    name: "Emergency & Critical Care",
    nameHi: "आपातकालीन चिकित्सा",
    description: "Urgent care guidance, trauma and critical care specialists.",
    icon: "Ambulance",
    image: emergency,
  },
];

export const getSpecialty = (slug: string) => SPECIALTIES.find((s) => s.slug === slug);
