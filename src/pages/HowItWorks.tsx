
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Calendar, User, ShieldCheck, ClipboardCheck, DollarSign, X, Send, Briefcase, FileCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const flowVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const HowItWorks = () => {
  const projectWorkflowRef = useRef<HTMLDivElement>(null);
  const studentSelectionRef = useRef<HTMLDivElement>(null);
  const projectWorkflowInView = useInView(projectWorkflowRef, { once: true, amount: 0.2 });
  const studentSelectionInView = useInView(studentSelectionRef, { once: true, amount: 0.2 });

  // Project workflow steps
  const projectSteps = [
    {
      title: "Client Submits Project",
      description: "Businesses submit detailed project requirements, budget, and deadline through our platform.",
      icon: <Briefcase />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Admin Verification",
      description: "Our team reviews projects to ensure they meet our quality standards and are suitable for student freelancers.",
      icon: <ShieldCheck />,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Student Application",
      description: "Qualified students review project details and apply with a proposal. A 5% application fee is required to ensure serious applications.",
      icon: <Send />,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      title: "Project Completion",
      description: "Student completes the project according to specifications and submits for client review.",
      icon: <FileCheck />,
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Successful Delivery",
      description: "If the client approves the work, the student receives full payment, including the initial 5% fee.",
      icon: <CheckCircle />,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Unsuccessful Delivery",
      description: "If the project fails to meet requirements, the client receives a full refund plus the 5% penalty fee paid by the student.",
      icon: <X />,
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    },
  ];

  // Student selection workflow steps
  const studentSteps = [
    {
      title: "Application Submission",
      description: "Students submit their basic information, educational background, skills, and portfolio samples.",
      icon: <User />,
      color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
    },
    {
      title: "Admin Skill Check",
      description: "Our team reviews the submitted materials to verify claimed skills and experiences.",
      icon: <ClipboardCheck />,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Technical Assessment",
      description: "Students complete a skills-based assessment relevant to their field to demonstrate practical knowledge.",
      icon: <Clock />,
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Final Interview",
      description: "A brief video interview to discuss goals, availability, and commitment to the platform.",
      icon: <Users />,
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    },
    {
      title: "Account Activation",
      description: "If all steps are passed successfully, the student receives freelancer status and can start applying for projects.",
      icon: <DollarSign />,
      color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How KARE SkillHive Works</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding our processes helps both students and clients make the most of the platform. 
              Below you'll find our step-by-step workflows for project completion and student selection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Workflow Section */}
      <section ref={projectWorkflowRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Project Workflow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From submission to completion, here's how projects move through our platform.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {projectSteps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={projectWorkflowInView ? "visible" : "hidden"}
                variants={flowVariants}
                className="mb-12 relative"
              >
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {/* Timeline line */}
                  {index < projectSteps.length - 1 && (
                    <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-border dark:bg-muted md:left-[2.15rem]"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`rounded-full p-4 ${step.color} z-10`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="w-full">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Arrow to next step */}
                    {index < projectSteps.length - 1 && (
                      <div className="hidden md:flex justify-center my-4">
                        <ArrowRight className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Selection Workflow Section */}
      <section ref={studentSelectionRef} className="py-20 bg-muted dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Student Selection Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our thorough vetting process ensures that only qualified and committed students become freelancers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {studentSteps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={studentSelectionInView ? "visible" : "hidden"}
                variants={flowVariants}
                className="mb-16 relative"
              >
                {/* Vertical line connecting steps */}
                {index < studentSteps.length - 1 && (
                  <div className="absolute left-1/2 top-[6.5rem] w-0.5 h-16 bg-border dark:bg-muted transform -translate-x-1/2"></div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex rounded-full p-5 ${step.color} mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">How are students verified?</h3>
                <p className="text-muted-foreground">
                  Students must provide valid university credentials and go through a multi-step verification process 
                  including skills assessment and interviews to ensure they have the expertise they claim.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">What happens if a project isn't completed successfully?</h3>
                <p className="text-muted-foreground">
                  If a student fails to meet project requirements, clients receive a full refund plus the 5% penalty 
                  fee that was paid by the student during application. This ensures accountability.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">How are payments handled?</h3>
                <p className="text-muted-foreground">
                  All payments are secured in escrow until project completion. Our blockchain-based system ensures 
                  transparent, secure transactions with records available to all parties.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Can businesses request specific students?</h3>
                <p className="text-muted-foreground">
                  Yes, after a successful project, businesses can request the same student for future projects, 
                  building ongoing professional relationships while maintaining the student's anonymity until both parties agree.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-skill-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join KARE SkillHive?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your journey as a student freelancer or post your first project as a business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a 
              href="/apply"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary bg-white text-skill-primary px-8 py-3 rounded-lg font-medium"
            >
              Apply as Freelancer
            </motion.a>
            <motion.a 
              href="/post-project"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline border-2 border-white text-white px-8 py-3 rounded-lg font-medium"
            >
              Post a Project
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
