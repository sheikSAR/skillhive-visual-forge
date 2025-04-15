import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ProjectType, ApplicationType } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const TrackProjects = () => {
  const { user, isClient } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientProjects = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        toast.error("Failed to load projects");
        return;
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select(`*, profile:profiles(*)`)
        .in(
          "project_id", 
          projectsData && projectsData.length > 0 ? projectsData.map(project => project.id) : []
        );

      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        toast.error("Failed to load applications");
      }

      setProjects(projectsData as ProjectType[] || []);
      setApplications(applicationsData as ApplicationType[] || []);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading your projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClientProjects();
    }
  }, [user]);

  // Update application status
  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", appId);

      if (error) {
        console.error("Error updating application:", error);
        toast.error("Failed to update application status");
        return;
      }

      // If approving, update project status to assigned
      if (status === "approved") {
        const application = applications.find(app => app.id === appId);
        if (application) {
          await supabase
            .from("projects")
            .update({ status: "assigned" })
            .eq("id", application.project_id);
        }
      }

      toast.success(`Application ${status}`);
      fetchClientProjects(); // Refresh data
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while updating application status");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isClient) {
    navigate("/dashboard");
    return null;
  }

  // Group projects by status
  const openProjects = projects.filter(p => p.status === "open");
  const assignedProjects = projects.filter(p => p.status === "assigned");
  const completedProjects = projects.filter(p => p.status === "completed");
  const cancelledProjects = projects.filter(p => p.status === "cancelled");

  // Get applications for a specific project
  const getProjectApplications = (projectId: string) => 
    applications ? applications.filter(app => app.project_id === projectId) : [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "assigned": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "completed": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-6">Track Your Projects</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="open">
          <TabsList className="mb-6">
            <TabsTrigger value="open">
              Open ({openProjects.length})
            </TabsTrigger>
            <TabsTrigger value="assigned">
              Assigned ({assignedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledProjects.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Open Projects Tab */}
          <TabsContent value="open" className="space-y-6">
            {openProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any open projects.</p>
                <Button 
                  onClick={() => navigate('/post-project')}
                  className="mt-4"
                >
                  Post a New Project
                </Button>
              </div>
            ) : (
              openProjects.map(project => (
                <Card key={project.id} className="mb-6">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-2">
                          Posted on {format(new Date(project.created_at), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>${project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                        <p>{format(new Date(project.deadline), "PPP")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                        <p>{project.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.skills && project.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Applications ({getProjectApplications(project.id).length})</h3>
                      {getProjectApplications(project.id).length === 0 ? (
                        <p className="text-muted-foreground">No applications yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {getProjectApplications(project.id).map(app => (
                            <div key={app.id} className="border p-4 rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{app.profile?.full_name || "Anonymous"}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Applied on {format(new Date(app.created_at), "PPP")}
                                  </p>
                                </div>
                                <Badge className={getStatusBadgeColor(app.status)}>
                                  {app.status.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-sm font-medium">Cover Letter:</p>
                                <p className="text-sm mt-1">{app.cover_letter}</p>
                              </div>
                              
                              {app.status === "pending" && (
                                <div className="mt-4 flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => updateApplicationStatus(app.id, "approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateApplicationStatus(app.id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Assigned Projects Tab */}
          <TabsContent value="assigned" className="space-y-6">
            {assignedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any assigned projects.</p>
              </div>
            ) : (
              assignedProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-2">
                          Posted on {format(new Date(project.created_at), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Similar content structure as in open projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>${project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                        <p>{format(new Date(project.deadline), "PPP")}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Assigned Freelancer</h3>
                      {applications && applications.filter(app => app.project_id === project.id && app.status === "approved").map(app => (
                        <div key={app.id} className="border p-4 rounded-md">
                          <p className="font-medium">{app.profile?.full_name || "Anonymous"}</p>
                          <Button 
                            className="mt-4"
                            onClick={async () => {
                              await supabase
                                .from("projects")
                                .update({ status: "completed" })
                                .eq("id", project.id);
                              fetchClientProjects();
                              toast.success("Project marked as completed!");
                            }}
                          >
                            Mark as Completed
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {completedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any completed projects.</p>
              </div>
            ) : (
              completedProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-2">
                          Posted on {format(new Date(project.created_at), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Similar structure but with simplified content for completed projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>${project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed on</p>
                        <p>{format(new Date(), "PPP")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-6">
            {cancelledProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You don't have any cancelled projects.</p>
              </div>
            ) : (
              cancelledProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-2">
                          Posted on {format(new Date(project.created_at), "PPP")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Similar structure but with simplified content for cancelled projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>${project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Deadline (was)</p>
                        <p>{format(new Date(project.deadline), "PPP")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TrackProjects;
