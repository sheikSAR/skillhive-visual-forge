
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface FreelancerApplicationsListProps {
  applications: FreelancerApplication[];
  onRefresh: () => void;
}

const FreelancerApplicationsList = ({ applications, onRefresh }: FreelancerApplicationsListProps) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const approveFreelancer = async (userId: string) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
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
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while approving freelancer application");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const rejectFreelancer = async (userId: string) => {
    toast.info("Freelancer application rejected");
    // In a real application, you might update some status field or delete the application
  };

  return (
    <>
      {applications.length === 0 ? (
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
            {applications.map((app) => (
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
                        disabled={processingIds.includes(app.user_id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Approve
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => rejectFreelancer(app.user_id)}
                        disabled={processingIds.includes(app.user_id)}
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
    </>
  );
};

export default FreelancerApplicationsList;
