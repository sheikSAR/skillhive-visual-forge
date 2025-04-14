
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ProjectType, ApplicationType } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, BookOpen, DollarSign, CheckCircle } from "lucide-react";
import DashboardWrapper from "@/components/DashboardWrapper";
import DashboardScene from "@/components/3D/DashboardScene";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [activeProjects, setActiveProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, completed: 0 });
  const [stats, setStats] = useState({
    completedProjects: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    averageRating: 4.8
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
        // Fetch user's applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*, project:projects(*)')
          .eq('user_id', user.id);

        if (applicationsError) throw applicationsError;

        // Get approved applications projects
        const approvedAppIds = applicationsData
          ?.filter(app => app.status === 'approved')
          .map(app => app.project_id) || [];

        // Fetch active projects (approved applications)
        const { data: activeProjectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', approvedAppIds.length > 0 ? approvedAppIds : ['no-matching-id']);

        if (projectsError) throw projectsError;

        // Calculate earnings (mock data)
        const mockEarnings = {
          total: activeProjectsData?.reduce((acc, project) => acc + Number(project.budget), 0) || 0,
          pending: activeProjectsData?.filter(p => p.status === 'assigned').reduce((acc, project) => acc + Number(project.budget), 0) || 0,
          completed: activeProjectsData?.filter(p => p.status === 'completed').reduce((acc, project) => acc + Number(project.budget), 0) || 0
        };

        // Set stats
        const mockStats = {
          completedProjects: activeProjectsData?.filter(p => p.status === 'completed').length || 0,
          pendingApplications: applicationsData?.filter(a => a.status === 'pending').length || 0,
          rejectedApplications: applicationsData?.filter(a => a.status === 'rejected').length || 0,
          averageRating: 4.8 // Mock rating
        };

        // Cast the data to our expected types
        setApplications(applicationsData as ApplicationType[] || []);
        setActiveProjects(activeProjectsData as ProjectType[] || []);
        setEarnings(mockEarnings);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  return (
    <DashboardWrapper title="Freelancer Dashboard" isLoading={isLoading}>
      <TabsContent value="overview" className="space-y-4">
        {/* 3D Interactive Scene */}
        <div ref={sceneContainer} className="h-64 rounded-lg overflow-hidden mb-6">
          <DashboardScene 
            stats={[
              { label: "Projects", value: stats.completedProjects, icon: "project" },
              { label: "Applications", value: stats.pendingApplications, icon: "application" },
              { label: "Earnings", value: earnings.total, icon: "money" },
              { label: "Rating", value: stats.averageRating, icon: "star" }
            ]}
            containerRef={sceneContainer}
          />
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.total}</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedProjects} projects completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Applications
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">
                {stats.rejectedApplications} applications rejected
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                Rating: {stats.averageRating}/5
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Active Projects */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Your currently assigned projects
              </CardDescription>
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
                  {activeProjects.length > 0 ? (
                    activeProjects.map((project) => (
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
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No active projects found. Apply for projects to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Applications */}
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your recently submitted applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.project?.title || "Unknown Project"}</TableCell>
                        <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span 
                              className={`h-2 w-2 rounded-full mr-2 ${
                                application.status === 'pending' 
                                  ? 'bg-yellow-500' 
                                  : application.status === 'approved' 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                              }`} 
                            />
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No applications found. Start applying for projects!
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

export default FreelancerDashboard;
