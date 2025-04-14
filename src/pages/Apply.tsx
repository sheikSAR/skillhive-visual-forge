
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, ArrowRight, Loader2, Upload, CheckCircle } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const applySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(2, "University name must be at least 2 characters"),
  major: z.string().min(2, "Please enter your field of study"),
  skills: z.string().min(2, "Please enter at least one skill"),
  experience: z.string().min(20, "Please provide some details about your experience"),
  portfolio: z.string().optional(),
  github: z.string().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

const Apply = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      university: "",
      major: "",
      skills: "",
      experience: "",
      portfolio: "",
      github: "",
    },
  });

  const onSubmit = async (data: ApplyFormValues) => {
    setSubmitting(true);
    
    try {
      // In a real implementation, we would upload the resume and submit to Supabase
      let resumeUrl = "";
      
      if (resumeFile) {
        // Upload resume to storage
        const fileExt = resumeFile.name.split('.').pop();
        const filePath = `${user?.id || 'anonymous'}-${Date.now()}.${fileExt}`;
        
        // This would be the actual upload in a real implementation
        /*
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('resumes')
          .upload(filePath, resumeFile);
          
        if (uploadError) throw uploadError;
        resumeUrl = filePath;
        */
        
        // Mock the upload
        resumeUrl = `https://example.com/resumes/${filePath}`;
      }
      
      // Submit application to database
      /*
      const { error } = await supabase
        .from('freelancer_applications')
        .insert({
          user_id: user?.id,
          full_name: data.fullName,
          email: data.email,
          university: data.university,
          major: data.major,
          skills: data.skills.split(',').map(skill => skill.trim()),
          experience: data.experience,
          portfolio_url: data.portfolio,
          github_url: data.github,
          resume_url: resumeUrl,
          status: 'pending',
        });
        
      if (error) throw error;
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your application has been submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    const currentFields = step === 1
      ? ["fullName", "email", "university", "major"]
      : ["skills", "experience"];
      
    // Validate the current step's fields
    const isValid = currentFields.every(field => {
      const result = form.trigger(field as keyof ApplyFormValues);
      return result;
    });
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      setResumeFile(file);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="container mx-auto max-w-md px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for applying to KARE SkillHive. We'll review your application and get back to you within 3-5 business days.
            </p>
            <Button asChild size="lg">
              <a href="/">Return to Home</a>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero section */}
      <section className="bg-muted dark:bg-slate-900/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-bold mb-4">Apply as a Freelancer</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community of talented student freelancers and gain real-world experience while earning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps indicator */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {step > 1 ? <CheckCircle2 size={18} /> : 1}
              </div>
              <div className={`flex-1 h-1 ${step > 1 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {step > 2 ? <CheckCircle2 size={18} /> : 2}
              </div>
              <div className={`flex-1 h-1 ${step > 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? "text-primary" : "text-muted-foreground"}>
                Basic Info
              </span>
              <span className={step >= 2 ? "text-primary" : "text-muted-foreground"}>
                Skills & Experience
              </span>
              <span className={step >= 3 ? "text-primary" : "text-muted-foreground"}>
                Portfolio & Submit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                          <p className="text-muted-foreground">
                            Tell us about yourself and your educational background.
                          </p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="john@university.edu"
                                  {...field} 
                                  disabled={!!user?.email}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University / College</FormLabel>
                              <FormControl>
                                <Input placeholder="KARE University" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="major"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Major / Field of Study</FormLabel>
                              <FormControl>
                                <Input placeholder="Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 2: Skills & Experience */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-2">Skills & Experience</h2>
                          <p className="text-muted-foreground">
                            Tell us about your skills and previous experience.
                          </p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills</FormLabel>
                              <FormControl>
                                <Input placeholder="React, JavaScript, UI Design, etc." {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter your skills separated by commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your previous experience, projects, or coursework related to your skills..."
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                          <Button type="button" onClick={nextStep}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 3: Portfolio & Submit */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-2">Portfolio & Submit</h2>
                          <p className="text-muted-foreground">
                            Share links to your work and upload your resume.
                          </p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="portfolio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://myportfolio.com" {...field} />
                              </FormControl>
                              <FormDescription>
                                Share a link to your portfolio website
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/yourusername" {...field} />
                              </FormControl>
                              <FormDescription>
                                Share a link to your GitHub profile
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-2">
                          <FormLabel>Resume/CV</FormLabel>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="resume-upload"
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                                resumeFile ? 'bg-primary/10 border-primary' : 'bg-muted hover:bg-muted/70'
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {resumeFile ? (
                                  <>
                                    <CheckCircle className="w-8 h-8 mb-3 text-primary" />
                                    <p className="mb-2 text-sm text-primary">
                                      <span className="font-semibold">{resumeFile.name}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Click to change file
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PDF or Word document (Max 5MB)
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleResumeChange}
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                              </>
                            ) : (
                              "Submit Application"
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apply;
