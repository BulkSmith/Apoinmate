/** Appointment data operations (Lovable Cloud / Supabase). */
import { supabase } from "@/integrations/supabase/client";
import type { Doctor } from "@/types/doctor";
import type {
  AppointmentSource,
  ConsultationType,
  NewAppointment,
} from "@/types/appointment";

export function buildAppointment(input: {
  userId: string;
  doctor: Doctor;
  date: string;
  time: string;
  consultationType?: ConsultationType;
  source: AppointmentSource;
  notes?: string | null;
}): NewAppointment {
  const { doctor } = input;
  return {
    user_id: input.userId,
    doctor_id: doctor.id,
    doctor_name: doctor.name,
    specialty: doctor.specialty,
    clinic: doctor.clinic,
    city: doctor.city,
    appointment_date: input.date,
    appointment_time: input.time,
    consultation_type: input.consultationType ?? "in-clinic",
    fee: doctor.fee,
    status: "confirmed",
    source: input.source,
    notes: input.notes ?? null,
  };
}

export async function createAppointment(appointment: NewAppointment) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointment)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMyAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
