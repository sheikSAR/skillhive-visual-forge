
import { useState, useEffect } from "react";
import { database } from "@/services/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await database.getProjects();
      
      if (error) {
        toast.error("Failed to fetch projects");
        return;
      }
      
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "assigned": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Management</CardTitle>
        <CardDescription>
          View and manage all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>${project.budget}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span 
                        className={`h-2 w-2 rounded-full mr-2 ${getStatusBadgeColor(project.status)}`} 
                      />
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsManagement;
