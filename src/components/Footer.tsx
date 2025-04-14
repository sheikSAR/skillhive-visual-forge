
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted dark:bg-slate-900 text-foreground">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-poppins font-bold text-xl mb-4">
              KARE <span className="text-skill-primary">SkillHive</span>
            </h3>
            <p className="text-muted-foreground">
              Connecting university talent with real-world projects. Build your portfolio, gain experience, and earn while you learn.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Students */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/apply" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Apply as Freelancer
                </Link>
              </li>
              <li>
                <Link to="/dashboard/student" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Clients */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Post a Project
                </a>
              </li>
              <li>
                <Link to="/dashboard/client" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  How to Hire
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Enterprise Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-skill-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} KARE SkillHive. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-skill-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-skill-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-skill-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
