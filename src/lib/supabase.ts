
import { createClient } from "@supabase/supabase-js";
import { supabase as integrationsSupabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Use the integration client directly to avoid duplication
export const supabase = integrationsSupabase;

// Re-export types for convenience
export type ProjectType = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  client_id: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  created_at: string;
  skills?: string[];
};

export type UserProfileType = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  is_freelancer: boolean;
  created_at: string;
  updated_at: string;
};

export type ApplicationType = {
  id: string;
  project_id: string;
  user_id: string;
  cover_letter: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profile?: UserProfileType;
  project?: ProjectType;
};

// TypeScript helper to strongly type the Supabase client with our database types
// This is used to overcome type issues with the existing supabase client
export type Tables = Database['public']['Tables'];
export type TablesInsert = Database['public']['Tables'];
export type TablesUpdate = Database['public']['Tables'];

// A helper typing function for debugging - no runtime impact
export function typedSupa() {
  return {
    // Typed version of from to use in helper functions
    from: <T extends keyof Tables>(table: T) => {
      return supabase.from(table);
    }
  };
}

// Fix the supabase client to work with TypeScript
// This doesn't actually create a new client, it just types the existing one
export const supabaseTyped = supabase as unknown as ReturnType<typeof createClient<Database>>;

