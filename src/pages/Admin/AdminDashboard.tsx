
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { isAdmin, user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [freelancerApplications, setFreelancerApplications] = useState<FreelancerApplication[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (authLoading) {
          return;
        }
        
        if (isAdmin) {
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
  }, [navigate, isAdmin, authLoading, refreshTrigger]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success("Refreshing data...");
  };

  const fetchFreelancerApplications = async () => {
    try {
      setIsLoading(true);
      
      // Use a more optimized query with a single fetch
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFreelancer = async (userId: string) => {
    toast.info("Freelancer application rejected");
    // In a real application, you might update some status field or delete the application
  };

  // If still checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-24 px-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  // If authenticated as admin, show dashboard
  if (isAuthenticated) {
    return (
      <div className="container mx-auto py-24 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw size={16} /> Refresh Data
          </Button>
        </div>
        
        <Tabs defaultValue="freelancer-applications" className="space-y-6">
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
                <CardTitle>Student Applications</CardTitle>
                <CardDescription>
                  Manage student applications to become freelancers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {freelancerApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No student applications yet.</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of student applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {freelancerApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.profile.full_name}</TableCell>
                          <TableCell>{format(new Date(app.created_at), "PPP")}</TableCell>
                          <TableCell>
                            <Badge variant={app.status === "approved" ? "secondary" : "default"}>
                              {app.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {app.status === "pending" ? (
                              <div className="flex gap-2 justify-end">
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
                            ) : (
                              <span className="text-green-600 font-medium flex items-center justify-end">
                                <CheckCircle size={16} className="mr-1" /> Approved
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
  }

  // If not authenticated, show nothing (redirect happens in useEffect)
  return null;
};

export default AdminDashboard;

