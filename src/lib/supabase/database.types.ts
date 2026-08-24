/**
 * Database types — generate from Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT > src/lib/supabase/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          physician_id: string;
          display_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          physician_id: string;
          display_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          physician_id?: string;
          display_code?: string;
          created_at?: string;
        };
      };
      consultation_records: {
        Row: {
          id: string;
          patient_id: string;
          physician_id: string;
          plan_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          physician_id: string;
          plan_json: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          physician_id?: string;
          plan_json?: Json;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
