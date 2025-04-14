
import { createClient } from "@supabase/supabase-js";
import { supabase as integrationsSupabase } from "@/integrations/supabase/client";

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
