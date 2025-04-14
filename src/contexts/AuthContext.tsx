
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, accountType?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isFreelancer: boolean;
  isClient: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session fetch error:", error);
          toast.error("Failed to fetch user session");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile if user exists
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
          } else {
            setProfile(profile);
          }
        }
      } catch (err) {
        console.error("Unexpected error in session setup:", err);
        toast.error("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    setData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update profile when auth state changes
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("Profile fetch error on auth change:", profileError);
            } else {
              setProfile(profile);
            }
          } catch (err) {
            console.error("Profile fetch unexpected error:", err);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName: string, accountType = "client") => {
    try {
      setLoading(true);
      console.log("Starting signup process...");
      
      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Failed to sign up");
        return;
      }

      if (!data.user) {
        toast.error("User account creation failed. Please try again.");
        return;
      }

      console.log("User created, creating profile...");
      
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            full_name: fullName,
            is_freelancer: accountType === "freelancer", // Set based on account type
          },
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Account created but profile setup failed. Please contact support.");
        return;
      }
      
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast.error(error?.message || "Failed to sign up. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message || "Failed to sign in");
        return;
      }
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Unexpected signin error:", error);
      toast.error(error?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(error.message || "Failed to sign out");
        return;
      }
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Unexpected signout error:", error);
      toast.error(error?.message || "Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFreelancer = !!profile?.is_freelancer;
  const isClient = !!profile && !profile.is_freelancer;

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isFreelancer,
    isClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
