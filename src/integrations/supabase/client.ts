
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yvtdpfampfndlnjqoocm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dGRwZmFtcGZuZGxuanFvb2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDkxMDEsImV4cCI6MjA1NzgyNTEwMX0.cT9Mbkdb2xPswXHD4DWvR-GjTJGsHiqi-NNr3igokcw";

// Create a custom types file and add the shared_designs table
export type CustomDatabase = Database & {
  public: {
    Tables: {
      shared_designs: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          image_url: string;
          prompt: string | null;
          nail_shape: string | null;
          nail_color: string | null;
          nail_length: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          image_url: string;
          prompt?: string | null;
          nail_shape?: string | null;
          nail_color?: string | null;
          nail_length?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          image_url?: string;
          prompt?: string | null;
          nail_shape?: string | null;
          nail_color?: string | null;
          nail_length?: string | null;
        };
        Relationships: [];
      };
      saved_designs: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          image_url: string;
          prompt: string | null;
          nail_shape: string | null;
          nail_color: string | null;
          nail_length: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          image_url: string;
          prompt?: string | null;
          nail_shape?: string | null;
          nail_color?: string | null;
          nail_length?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          image_url?: string;
          prompt?: string | null;
          nail_shape?: string | null;
          nail_color?: string | null;
          nail_length?: string | null;
        };
        Relationships: [];
      };
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    } & Database['public']['Tables'];
  };
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
