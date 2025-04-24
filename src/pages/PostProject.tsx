
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Budget must be a positive number" }
  ),
  deadline: z.string().refine(
    (val) => new Date(val) > new Date(),
    { message: "Deadline must be in the future" }
  ),
  category: z.string().min(1, "Please select a category"),
  skills: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
  "Machine Learning",
  "Content Writing",
  "Digital Marketing",
  "Other",
];

const PostProject = () => {
  const { user, isClient } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: "",
      category: "",
      skills: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) {
      toast.error("You must be logged in to post a project");
      navigate("/login");
      return;
    }

    if (!isClient) {
      toast.error("Only clients can post projects");
      return;
    }

    setIsLoading(true);
    try {
      // Parse skills string into array
      const skillsArray = data.skills
        ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

      const { error } = await supabase.from("projects").insert({
        title: data.title,
        description: data.description,
        budget: Number(data.budget),
        deadline: data.deadline,
        category: data.category,
        skills: skillsArray,
        client_id: user.id,
        status: "open",
      });

      if (error) {
        console.error("Error posting project:", error);
        toast.error(error.message || "Failed to post project");
        return;
      }

      toast.success("Project posted successfully");
      navigate("/track-projects");
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error(error?.message || "Failed to post project. Please try again.");
    } finally {
      setIsLoading(false);
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

  return (
    <div className="container mx-auto py-24 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a New Project</CardTitle>
          <CardDescription>
            Fill in the details below to post your project and find skilled freelancers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Build an E-commerce Website"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project requirements in detail"
                        className="h-32"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (in $)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          placeholder="e.g. 500"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          disabled={isLoading}
                          min={new Date().toISOString().split("T")[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isLoading}
                          {...field}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. React, Node.js, UI Design"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting Project...
                  </>
                ) : (
                  "Post Project"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostProject;
