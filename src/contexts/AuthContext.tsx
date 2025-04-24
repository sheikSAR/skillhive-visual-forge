
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { database, AuthUser } from "@/services/database";

type AuthContextType = {
  user: AuthUser | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, accountType?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isFreelancer: boolean;
  isClient: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setProfile(parsedUser);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName: string, accountType = "client") => {
    try {
      setLoading(true);
      console.log("Starting signup process...");
      
      const { data, error } = await database.signUp(email, password, fullName, accountType);

      if (error) {
        console.error("Signup error:", error);
        toast.error(error || "Failed to sign up");
        return;
      }

      if (!data?.user) {
        toast.error("User account creation failed. Please try again.");
        return;
      }
      
      toast.success("Account created successfully! Please login to continue.");
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
      const { data, error } = await database.signIn(email, password);

      if (error) {
        console.error("Sign in error:", error);
        toast.error(error || "Failed to sign in");
        return;
      }
      
      if (data?.user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setProfile(data.user);
        toast.success("Signed in successfully!");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
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
      // Clear local storage
      localStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setProfile(null);
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Unexpected signout error:", error);
      toast.error(error?.message || "Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFreelancer = !!user?.is_freelancer;
  const isClient = !!user && !user.is_freelancer;
  const isAdmin = !!user?.is_admin;

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isFreelancer,
    isClient,
    isAdmin,
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
