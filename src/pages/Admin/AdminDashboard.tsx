
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type FreelancerApplication = {
  id: string;
  user_id: string;
  profile: {
    full_name: string;
    email?: string;
    bio?: string;
  };
  status: string;
  created_at: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [freelancerApplications, setFreelancerApplications] = useState<FreelancerApplication[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session.session?.user?.email === "adminkareskillhive@klu.ac.in") {
          setIsAuthenticated(true);
          fetchFreelancerApplications();
        } else {
          toast.error("You don't have admin access");
          navigate("/login");
        }
      } catch (error) {
        console.error("Admin auth check error:", error);
        toast.error("Authentication error");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Admin login error:", error);
        toast.error(error.message || "Failed to sign in");
        return;
      }

      if (data.user?.email === "adminkareskillhive@klu.ac.in") {
        setIsAuthenticated(true);
        fetchFreelancerApplications();
        toast.success("Admin logged in successfully");
      } else {
        toast.error("You don't have admin access");
        await supabase.auth.signOut();
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Unexpected signin error:", error);
      toast.error(error?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFreelancerApplications = async () => {
    try {
      setIsLoading(true);
      
      // Use a more optimized query with a single fetch
      // This helps improve performance by reducing database round trips
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_freelancer", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching freelancer applications:", error);
        toast.error("Failed to load freelancer applications");
        return;
      }

      // Format as applications
      const formattedApplications = profiles.map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        profile: {
          full_name: profile.full_name || "Anonymous",
          bio: profile.bio,
        },
        status: profile.is_freelancer ? "approved" : "pending",
        created_at: profile.created_at,
      }));

      setFreelancerApplications(formattedApplications);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading freelancer applications");
    } finally {
      setIsLoading(false);
    }
  };

  const approveFreelancer = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_freelancer: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Error approving freelancer:", error);
        toast.error("Failed to approve freelancer application");
        return;
      }

      toast.success("Freelancer application approved");
      fetchFreelancerApplications(); // Refresh data
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while approving freelancer application");
    }
  };

  const rejectFreelancer = async (userId: string) => {
    // For rejection, we could either delete the profile or just leave it marked as not freelancer
    // For now, we'll just notify and keep the profile as is
    toast.info("Freelancer application rejected");
    // In a real application, you might update some status field or delete the application
  };

  // Show login form if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="container mx-auto py-24 px-4 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                handleAdminLogin(email, password);
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full p-2 border rounded"
                  defaultValue="adminkareskillhive@klu.ac.in"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-2 border rounded"
                  defaultValue="qwer1432"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 px-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="freelancer-applications">
        <TabsList className="mb-6">
          <TabsTrigger value="freelancer-applications">
            Freelancer Applications ({freelancerApplications.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="freelancer-applications">
          <Card>
            <CardHeader>
              <CardTitle>Freelancer Applications</CardTitle>
              <CardDescription>
                Manage freelancer applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {freelancerApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No freelancer applications yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {freelancerApplications.map((app) => (
                    <div key={app.id} className="border p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{app.profile.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied on {format(new Date(app.created_at), "PPP")}
                          </p>
                          {app.profile.bio && (
                            <p className="mt-2 text-sm">{app.profile.bio}</p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {app.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {app.status === "pending" && (
                        <div className="mt-4 flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => approveFreelancer(app.user_id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => rejectFreelancer(app.user_id)}
                            className="flex items-center gap-1"
                          >
                            <XCircle size={16} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
              <CardDescription>
                View and manage all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Project management functionality would go here */}
              <div className="text-center py-8">
                <p className="text-muted-foreground">Project management functionality coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User management functionality would go here */}
              <div className="text-center py-8">
                <p className="text-muted-foreground">User management functionality coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
