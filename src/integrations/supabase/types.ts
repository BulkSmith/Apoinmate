export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          city: string | null
          clinic: string | null
          consultation_type: string
          created_at: string
          doctor_id: string
          doctor_name: string
          fee: number
          id: string
          notes: string | null
          paid_at: string | null
          patient_name: string | null
          payment_method: string | null
          payment_status: string
          source: string
          specialty: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          city?: string | null
          clinic?: string | null
          consultation_type?: string
          created_at?: string
          doctor_id: string
          doctor_name: string
          fee?: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          patient_name?: string | null
          payment_method?: string | null
          payment_status?: string
          source?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          city?: string | null
          clinic?: string | null
          consultation_type?: string
          created_at?: string
          doctor_id?: string
          doctor_name?: string
          fee?: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          patient_name?: string | null
          payment_method?: string | null
          payment_status?: string
          source?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_applications: {
        Row: {
          about: string | null
          area: string | null
          city: string | null
          clinic_name: string | null
          consultation_fee: number | null
          created_at: string
          current_step: number
          documents: Json
          experience_years: number | null
          full_name: string | null
          id: string
          languages: string | null
          payout_account_name: string | null
          payout_account_number: string | null
          payout_ifsc: string | null
          payout_method: string | null
          payout_upi: string | null
          phone: string | null
          qualification: string | null
          registration_council: string | null
          registration_number: string | null
          specialty: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string | null
          area?: string | null
          city?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          created_at?: string
          current_step?: number
          documents?: Json
          experience_years?: number | null
          full_name?: string | null
          id?: string
          languages?: string | null
          payout_account_name?: string | null
          payout_account_number?: string | null
          payout_ifsc?: string | null
          payout_method?: string | null
          payout_upi?: string | null
          phone?: string | null
          qualification?: string | null
          registration_council?: string | null
          registration_number?: string | null
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string | null
          area?: string | null
          city?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          created_at?: string
          current_step?: number
          documents?: Json
          experience_years?: number | null
          full_name?: string | null
          id?: string
          languages?: string | null
          payout_account_name?: string | null
          payout_account_number?: string | null
          payout_ifsc?: string | null
          payout_method?: string | null
          payout_upi?: string | null
          phone?: string | null
          qualification?: string | null
          registration_council?: string | null
          registration_number?: string | null
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_listings: {
        Row: {
          about: string | null
          area: string | null
          city: string | null
          clinic: string | null
          created_at: string
          experience_years: number | null
          fee: number
          id: string
          is_active: boolean
          languages: string | null
          name: string
          qualification: string | null
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string | null
          area?: string | null
          city?: string | null
          clinic?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number
          id: string
          is_active?: boolean
          languages?: string | null
          name: string
          qualification?: string | null
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string | null
          area?: string | null
          city?: string | null
          clinic?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number
          id?: string
          is_active?: boolean
          languages?: string | null
          name?: string
          qualification?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_schedules: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_active: boolean
          slot_minutes: number
          start_time: string
          user_id: string
          weekday: number
        }
        Insert: {
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          slot_minutes?: number
          start_time?: string
          user_id: string
          weekday: number
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          slot_minutes?: number
          start_time?: string
          user_id?: string
          weekday?: number
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string
          doctor_name: string | null
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          notes: string | null
          record_date: string
          record_type: Database["public"]["Enums"]["medical_record_type"]
          size_bytes: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_name?: string | null
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          record_date?: string
          record_type?: Database["public"]["Enums"]["medical_record_type"]
          size_bytes?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_name?: string | null
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          record_date?: string
          record_type?: Database["public"]["Enums"]["medical_record_type"]
          size_bytes?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_group: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          id: string
          onboarding_complete: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          onboarding_complete?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          onboarding_complete?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      medical_record_type:
        | "prescription"
        | "report"
        | "lab"
        | "invoice"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      medical_record_type: [
        "prescription",
        "report",
        "lab",
        "invoice",
        "other",
      ],
    },
  },
} as const
