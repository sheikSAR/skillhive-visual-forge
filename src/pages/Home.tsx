
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Shield, Cpu, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroBackground from "@/components/HeroBackground";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Computer Science Student",
    university: "KARE University",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "SkillHive completely transformed my learning journey. I worked on real projects for actual clients while still in university, which gave me practical experience that my coursework couldn't provide. I've earned enough to cover my tuition and built an impressive portfolio!"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Design Student",
    university: "KARE University",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "As a design student, I was struggling to find internships that would give me real-world experience. Through SkillHive, I've worked with startups and established companies on branding projects. The anonymous workflow meant my work was judged purely on quality, not my student status."
  },
  {
    id: 3,
    name: "Michael Okonkwo",
    role: "Business Major",
    university: "KARE University",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "The skills assessment process was challenging but fair. Once I was accepted as a freelancer, projects started coming in consistently. I've been able to apply my business knowledge to real marketing campaigns while still completing my degree."
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Software Engineering Student",
    university: "KARE University",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    text: "SkillHive's project matching algorithm actually pairs me with work that fits my skill set and schedule. The blockchain payment system ensures I always get paid fairly and on time. It's been the perfect way to earn while learning."
  },
];

// Feature data
const features = [
  {
    title: "Earn While Learning",
    description: "Apply classroom knowledge to real-world projects while earning competitive rates to support your education.",
    icon: <DollarSign className="h-6 w-6 text-skill-primary" />,
  },
  {
    title: "Anonymous Workflow",
    description: "Your work is judged purely on quality, not your student status, ensuring fair opportunities for all.",
    icon: <Shield className="h-6 w-6 text-skill-primary" />,
  },
  {
    title: "Skill-based Entry",
    description: "Our thorough assessment process ensures only qualified students can participate, maintaining high quality standards.",
    icon: <Sparkles className="h-6 w-6 text-skill-primary" />,
  },
  {
    title: "Secure Payments",
    description: "All transactions are recorded and secured with advanced blockchain technology, guaranteeing payment protection.",
    icon: <Cpu className="h-6 w-6 text-skill-primary" />,
  },
];

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-32 overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect <span className="text-skill-primary">University Talent</span> with Real-World Projects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              KARE SkillHive bridges the gap between education and industry by connecting university students with businesses looking for fresh talent. Gain experience, build your portfolio, and earn while you learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-md" asChild>
                <Link to="/apply">Apply as Freelancer</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-md" asChild>
                <Link to="/projects">Browse Projects</Link>
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center">
                <h3 className="text-5xl font-bold text-skill-primary mb-2">500+</h3>
                <p className="text-lg text-muted-foreground">Active Students</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-5xl font-bold text-skill-accent mb-2">1,200+</h3>
                <p className="text-lg text-muted-foreground">Projects Completed</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-5xl font-bold text-skill-secondary mb-2">98%</h3>
                <p className="text-lg text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-muted dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose KARE SkillHive?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers unique advantages for both students and businesses, creating a win-win ecosystem for all participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">
                Learn How It Works <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Brief */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How KARE SkillHive Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform connects talented university students with businesses needing their skills, through a secure and efficient process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Students */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-skill-primary">For Students</h3>
              <ul className="space-y-6">
                {[
                  "Apply and demonstrate your skills through our assessment process",
                  "Browse available projects that match your expertise",
                  "Submit proposals and communicate with clients anonymously",
                  "Complete projects at your own pace while balancing studies",
                  "Build a verified portfolio of real-world work",
                  "Get paid securely and earn while learning"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link to="/apply">Apply Now</Link>
                </Button>
              </div>
            </div>

            {/* For Businesses */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-skill-accent">For Businesses</h3>
              <ul className="space-y-6">
                {[
                  "Post projects and get matched with qualified student talent",
                  "Review anonymous applications based purely on skill and quality",
                  "Get fresh perspectives from emerging professionals",
                  "Pay only when work meets your requirements",
                  "Support education while solving real business challenges",
                  "Build relationships with the next generation of professionals"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/post-project">Post a Project</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-24 bg-muted dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have transformed their educational journey through KARE SkillHive.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={index === currentTestimonial ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                  style={{ display: index === currentTestimonial ? 'block' : 'none' }}
                >
                  <Card className="p-8">
                    <CardContent className="p-0">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-lg mb-8">"{testimonial.text}"</p>
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-muted-foreground">{testimonial.role}, {testimonial.university}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              <div className="h-[400px]"></div>
            </div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === currentTestimonial ? "bg-skill-primary" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-skill-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a student looking to gain experience or a business seeking fresh talent, KARE SkillHive is your bridge to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-skill-primary hover:bg-gray-100" asChild>
              <Link to="/signup">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
