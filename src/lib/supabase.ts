
import { createClient } from "@supabase/supabase-js";

// Set default values for local development or use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Check if we're running in production
const isProd = import.meta.env.PROD;

if (isProd && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn("Warning: Missing Supabase credentials in production. Please set environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
