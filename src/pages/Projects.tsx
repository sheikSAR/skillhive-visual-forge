
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, DollarSign, Tags, ArrowUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, ProjectType } from "@/lib/supabase";
import { toast } from "sonner";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Categories for filtering
const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Marketing",
  "Data Analysis",
  "Video Production",
];

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"created_at" | "budget" | "deadline">("created_at");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'open');
        
        if (error) throw error;
        
        // In a real implementation, we would use the data from Supabase
        // For now, let's create mock data
        const mockProjects: ProjectType[] = [
          {
            id: "1",
            title: "E-commerce Website Redesign",
            description: "We need a complete redesign of our e-commerce website to improve user experience and increase conversions. Looking for fresh ideas and modern design principles.",
            budget: 2500,
            deadline: "2025-06-15",
            category: "Web Development",
            client_id: "client1",
            status: "open",
            created_at: "2025-04-01",
            skills: ["React", "Node.js", "UI/UX Design", "Figma"]
          },
          {
            id: "2",
            title: "Mobile App UI Design",
            description: "Design a clean, modern UI for our fitness tracking mobile application. Need wireframes, mockups, and final designs for iOS and Android platforms.",
            budget: 1800,
            deadline: "2025-05-20",
            category: "UI/UX Design",
            client_id: "client2",
            status: "open",
            created_at: "2025-04-05",
            skills: ["Mobile Design", "Figma", "Adobe XD", "User Research"]
          },
          {
            id: "3",
            title: "Content Writing for Blog",
            description: "We need 10 high-quality blog posts about digital marketing trends. Each article should be 1500-2000 words with SEO optimization.",
            budget: 800,
            deadline: "2025-05-10",
            category: "Content Writing",
            client_id: "client3",
            status: "open",
            created_at: "2025-04-08",
            skills: ["Content Writing", "SEO", "Research", "Digital Marketing"]
          },
          {
            id: "4",
            title: "Data Analysis for E-commerce",
            description: "Analyze 6 months of customer data to identify purchasing patterns and recommend strategies to increase customer retention and average order value.",
            budget: 1200,
            deadline: "2025-05-25",
            category: "Data Analysis",
            client_id: "client4",
            status: "open",
            created_at: "2025-04-10",
            skills: ["Data Analysis", "Python", "SQL", "Visualization"]
          },
          {
            id: "5",
            title: "Logo and Brand Identity Design",
            description: "Create a logo and brand identity for a new sustainable fashion brand targeting young adults. Need complete brand guidelines and assets.",
            budget: 1500,
            deadline: "2025-06-05",
            category: "Graphic Design",
            client_id: "client5",
            status: "open",
            created_at: "2025-04-12",
            skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Color Theory"]
          },
          {
            id: "6",
            title: "Mobile App Development - iOS",
            description: "Develop a native iOS app for our existing service. The backend API is already in place, we need a developer to build the mobile client.",
            budget: 3500,
            deadline: "2025-07-10",
            category: "Mobile Development",
            client_id: "client6",
            status: "open",
            created_at: "2025-04-15",
            skills: ["Swift", "iOS Development", "RESTful APIs", "UI Implementation"]
          },
        ];

        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter and sort projects whenever dependencies change
    let results = [...projects];
    
    // Apply category filter
    if (selectedCategory !== "All Categories") {
      results = results.filter(project => project.category === selectedCategory);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        project => 
          project.title.toLowerCase().includes(term) || 
          project.description.toLowerCase().includes(term) ||
          (project.skills && project.skills.some(skill => skill.toLowerCase().includes(term)))
      );
    }
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortBy === "budget") {
        return sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget;
      } else if (sortBy === "deadline") {
        return sortOrder === "asc" 
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime() 
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else {
        return sortOrder === "asc" 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    
    setFilteredProjects(results);
  }, [projects, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSort = (column: "created_at" | "budget" | "deadline") => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set to new column with default desc order
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero section */}
      <section className="bg-muted dark:bg-slate-900/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find projects that match your skills and interests. Apply to work with clients on real-world challenges.
          </p>
          
          {/* Search and filter */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                className="pl-10 pr-4 py-6 text-lg"
                placeholder="Search projects by title, description or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1 px-3"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Sort controls */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"} Available
            </h2>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("created_at")}
                className={sortBy === "created_at" ? "border-primary" : ""}
              >
                Date <ArrowUpDown size={16} className="ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("budget")}
                className={sortBy === "budget" ? "border-primary" : ""}
              >
                Budget <ArrowUpDown size={16} className="ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("deadline")}
                className={sortBy === "deadline" ? "border-primary" : ""}
              >
                Deadline <ArrowUpDown size={16} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* Projects grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading projects...</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          <Link to={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                            {project.title}
                          </Link>
                        </CardTitle>
                        <Badge>{project.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.skills?.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills && project.skills.length > 3 && (
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3 justify-between">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        ${project.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                        Due {formatDate(project.deadline)}
                      </div>
                      <Button asChild>
                        <Link to={`/projects/${project.id}`}>Apply Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl mb-2">No projects match your criteria</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
              }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
