/** Appointment domain types. */

export type ConsultationType = "in-clinic" | "video";

export type AppointmentSource = "web" | "chat";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type NewAppointment = {
  user_id: string;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  clinic: string;
  city: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: ConsultationType;
  fee: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes?: string | null;
  patient_name?: string | null;
  payment_status?: PaymentState;
  payment_method?: string | null;
};

export type PaymentState = "pending" | "paid" | "refunded";
