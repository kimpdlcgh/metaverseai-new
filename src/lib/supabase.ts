import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          date_of_birth: string | null;
          avatar_url: string | null;
          cover_image_url: string | null;
          bio: string | null;
          location: {
            street_address?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
          } | null;
          email_verified: boolean;
          phone_verified: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name: string;
          phone_number?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          bio?: string | null;
          location?: {
            street_address?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
          } | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string;
          phone_number?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          bio?: string | null;
          location?: {
            street_address?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
          } | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          birth_date: string | null;
          professional_bio: string | null;
          degree: string | null;
          college: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          birth_date?: string | null;
          professional_bio?: string | null;
          degree?: string | null;
          college?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          birth_date?: string | null;
          professional_bio?: string | null;
          degree?: string | null;
          college?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};