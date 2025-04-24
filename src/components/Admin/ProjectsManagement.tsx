
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectsManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Management</CardTitle>
        <CardDescription>
          View and manage all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Project management functionality coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsManagement;
