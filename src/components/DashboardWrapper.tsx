
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardWrapperProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
}

const DashboardWrapper = ({ 
  children, 
  title,
  isLoading = false 
}: DashboardWrapperProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[125px]" />
              ))}
            </div>
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        ) : (
          children
        )}
      </Tabs>
    </div>
  );
};

export default DashboardWrapper;
