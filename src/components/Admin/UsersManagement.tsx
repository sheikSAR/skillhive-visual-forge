
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UsersManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View and manage all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">User management functionality coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
