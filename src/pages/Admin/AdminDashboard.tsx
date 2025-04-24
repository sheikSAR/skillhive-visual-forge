
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { database } from "@/services/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import FreelancerApplicationsList from "@/components/Admin/FreelancerApplicationsList";
import ProjectsManagement from "@/components/Admin/ProjectsManagement";
import UsersManagement from "@/components/Admin/UsersManagement";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success("Refreshing data...");
  };

  const fetchFreelancerApplications = async () => {
    try {
      setIsLoading(true);
      
      // Use the database service instead of Supabase
      const { data, error } = await database.getFreelancerApplications();

      if (error) {
        console.error("Error fetching freelancer applications:", error);
        toast.error("Failed to load freelancer applications");
        return;
      }

      // Format data if needed
      const formattedApplications = (data || []).map(user => ({
        id: user.id,
        user_id: user.id,
        profile: {
          full_name: user.name || "Anonymous",
          bio: user.bio || "",
        },
        status: user.is_freelancer ? "approved" : "pending",
        created_at: user.created_at || new Date().toISOString(),
      }));

      setFreelancerApplications(formattedApplications);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading freelancer applications");
    } finally {
      setIsLoading(false);
    }
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
                <FreelancerApplicationsList 
                  applications={freelancerApplications} 
                  onRefresh={fetchFreelancerApplications} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // If not authenticated, show nothing (redirect happens in useEffect)
  return null;
};

export default AdminDashboard;
