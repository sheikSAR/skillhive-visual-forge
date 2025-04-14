
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-poppins font-bold text-2xl text-skill-primary">
            KARE <span className="text-skill-accent">SkillHive</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            How It Works
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            Browse Projects
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            Apply as Freelancer
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                "font-medium transition-colors hover:text-skill-primary",
                isActive ? "text-skill-primary" : "text-foreground"
              )
            }
          >
            Contact
          </NavLink>
          
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="mr-2"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-in-top">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Projects
            </NavLink>
            <NavLink
              to="/apply"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Apply as Freelancer
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "py-2 font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="w-1/2">
                <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="w-1/2">
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
