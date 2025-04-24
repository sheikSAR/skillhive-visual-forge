
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ProjectType, ApplicationType } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Users, PlusCircle, TrendingUp } from "lucide-react";
import DashboardWrapper from "@/components/DashboardWrapper";
import DashboardScene from "@/components/3D/DashboardScene";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0
  });
  const sceneContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch client's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', user.id);

        if (projectsError) {
          throw projectsError;
        }

        // Safely handle null data
        const safeProjectsData = projectsData || [];
        
        // Calculate stats
        const activeProjects = safeProjectsData.filter(p => p.status === 'open' || p.status === 'assigned').length || 0;
        const completedProjects = safeProjectsData.filter(p => p.status === 'completed').length || 0;
        const totalSpent = safeProjectsData
          .filter(p => p.status === 'completed')
          .reduce((acc, project) => acc + Number(project.budget), 0) || 0;

        setProjects(safeProjectsData);
        
        setStats({
          totalProjects: safeProjectsData.length,
          activeProjects,
          completedProjects,
          totalSpent
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleCreateProject = () => {
    navigate('/post-project');
  };

  return (
    <DashboardWrapper title="Client Dashboard" isLoading={isLoading}>
      <TabsContent value="overview" className="space-y-4">
        {/* 3D Interactive Scene */}
        <div ref={sceneContainer} className="h-64 rounded-lg overflow-hidden mb-6">
          <DashboardScene 
            stats={[
              { label: "Projects", value: stats.totalProjects, icon: "project" },
              { label: "Active", value: stats.activeProjects, icon: "active" },
              { label: "Completed", value: stats.completedProjects, icon: "application" },
              { label: "Spent", value: stats.totalSpent, icon: "money" }
            ]}
            containerRef={sceneContainer}
            isClient={true}
          />
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedProjects} projects completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects > 0 ? `${stats.activeProjects} in progress` : 'No active projects'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent
              </CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground">
                on {stats.completedProjects} completed projects
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Create Project
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
              <Button 
                className="mt-2 w-full" 
                onClick={handleCreateProject}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* My Projects */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                  Manage your current projects
                </CardDescription>
              </div>
              <Button size="sm" className="ml-auto" onClick={handleCreateProject}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>${project.budget}</TableCell>
                        <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span 
                              className={`h-2 w-2 rounded-full mr-2 ${
                                project.status === 'open' 
                                  ? 'bg-blue-500' 
                                  : project.status === 'assigned' 
                                    ? 'bg-yellow-500' 
                                    : project.status === 'completed' 
                                      ? 'bg-green-500' 
                                      : 'bg-red-500'
                              }`} 
                            />
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/track-projects')}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No projects found. Create your first project to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </DashboardWrapper>
  );
};

export default ClientDashboard;
