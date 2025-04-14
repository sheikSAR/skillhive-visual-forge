
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const About = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-muted dark:bg-slate-900/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About KARE SkillHive</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Bridging the gap between university education and real-world experience through a unique freelancing platform for students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                KARE SkillHive was founded with a simple yet powerful mission: to create meaningful connections 
                between talented university students and businesses seeking fresh perspectives and skills.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                We believe that learning shouldn't be confined to classrooms and that students deserve real-world 
                opportunities to apply their knowledge, build portfolios, and earn while still completing their education.
              </p>
              <p className="text-lg text-muted-foreground">
                Through our innovative platform, we're transforming how skills are exchanged, valued, and compensated in 
                the academic ecosystem, creating win-win relationships for both students and businesses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-slate-900 p-4 shadow-lg rounded-lg">
                <p className="text-lg font-medium text-skill-primary">Founded in 2023</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-muted dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Benefits for Students & Businesses
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our platform creates mutual value for both students seeking experience and businesses looking for fresh talent.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="rounded-full bg-skill-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                    <GraduationCap className="h-7 w-7 text-skill-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Students</h3>
                  <ul className="space-y-4">
                    {[
                      "Gain practical experience while still in university",
                      "Build a professional portfolio with real projects",
                      "Earn income to support your education",
                      "Develop client communication skills",
                      "Work on your own schedule around your classes",
                      "Receive feedback from real industry clients",
                      "Apply classroom knowledge to practical scenarios"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* For Businesses */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="rounded-full bg-skill-accent/10 w-14 h-14 flex items-center justify-center mb-6">
                    <Briefcase className="h-7 w-7 text-skill-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
                  <ul className="space-y-4">
                    {[
                      "Access a pool of talented and motivated students",
                      "Get fresh perspectives on your business challenges",
                      "Cost-effective solutions compared to agencies",
                      "Support education while solving business problems",
                      "Test potential future employees through real projects",
                      "Fast turnaround on smaller projects",
                      "Corporate social responsibility through educational support"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              These principles guide everything we do at KARE SkillHive.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8 text-yellow-500" />,
                title: "Excellence",
                description: "We maintain high standards in every project, ensuring quality deliverables for clients and valuable experiences for students."
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: "Collaboration",
                description: "We believe in the power of bringing diverse talents together to create innovative solutions to complex challenges."
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-green-500" />,
                title: "Education",
                description: "Learning is at the heart of our platform. We're committed to extending education beyond the classroom."
              },
              {
                icon: <Briefcase className="h-8 w-8 text-purple-500" />,
                title: "Opportunity",
                description: "Creating pathways for students to showcase their abilities and access real-world professional opportunities."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="rounded-full bg-muted w-16 h-16 mx-auto flex items-center justify-center mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-skill-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Join the KARE SkillHive Community</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a student looking to gain experience or a business seeking fresh talent, become part of our growing community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-skill-primary hover:bg-gray-100" 
                asChild
              >
                <Link to="/apply">Apply as a Student</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
