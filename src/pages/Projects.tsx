
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { database } from "@/services/database";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Search, Briefcase, Calendar, DollarSign, Filter, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Sample projects data for default projects
const defaultProjects = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Redesign of a company website with modern UI/UX principles",
    budget: 500,
    deadline: "2025-06-01",
    category: "Web Development",
    client_id: "default",
    status: "open",
    created_at: "2025-03-20",
    skills: ["React", "UI/UX", "Tailwind CSS"],
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Create a mobile app for a local business",
    budget: 800,
    deadline: "2025-07-15",
    category: "Mobile App",
    client_id: "default",
    status: "open",
    created_at: "2025-03-22",
    skills: ["React Native", "Firebase", "App Design"],
  },
  {
    id: "3",
    title: "Logo Design",
    description: "Design a modern logo for a tech startup",
    budget: 200,
    deadline: "2025-05-10",
    category: "Design",
    client_id: "default",
    status: "open",
    created_at: "2025-03-25",
    skills: ["Graphic Design", "Branding", "Illustrator"],
  }
];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isFreelancer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await database.getProjects();
        
        if (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to load projects");
        } else {
          // Filter only open projects from clients
          const openProjects = (data || []).filter((project: any) => 
            project.status === "open" && project.client_id !== "default"
          );
          setClientProjects(openProjects);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An error occurred while loading projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientProjects();
  }, []);

  // Combine default projects with client projects
  const allProjects = [...defaultProjects, ...clientProjects];

  // Filter projects by search term and category
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || project.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleApply = (projectId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isFreelancer) {
      navigate("/apply");
      return;
    }

    // Navigate to project application
    navigate(`/project/${projectId}/apply`);
  };

  const categories = ["all", "Web Development", "Mobile App", "Design", "Content Writing", "Data Analysis"];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero section */}
      <section className="bg-muted dark:bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect project that matches your skills and interests.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and filter section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground" />
              <Tabs value={category} onValueChange={setCategory}>
                <TabsList>
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <span>Loading projects...</span>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Available Projects</h2>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No projects found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge variant="outline">{project.category}</Badge>
                        </div>
                        <CardDescription>
                          Posted on {format(new Date(project.created_at), "MMM d, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="mb-4">{project.description}</p>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Budget: ${project.budget}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Deadline: {format(new Date(project.deadline), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Status: {project.status.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.skills && Array.isArray(project.skills) && project.skills.map((skill: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleApply(project.id)}
                        >
                          Apply for this Project
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
