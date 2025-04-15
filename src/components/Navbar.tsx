
import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, ChevronDown, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut, isFreelancer, isClient, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Define navigation links based on user role
  const getNavigationLinks = () => {
    // Common links for all users
    const commonLinks = [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ];

    // Links for admin
    if (isAdmin) {
      return [
        { name: "Admin Dashboard", path: "/admin" },
        ...commonLinks
      ];
    }
    
    // Links for non-authenticated users
    if (!user) {
      return [
        { name: "Home", path: "/" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Browse Projects", path: "/projects" },
        { name: "Apply as Freelancer", path: "/apply" },
        ...commonLinks
      ];
    }

    // Links for clients
    if (isClient) {
      return [
        { name: "Client Dashboard", path: "/dashboard/client" },
        { name: "Post Project", path: "/post-project" },
        { name: "Track Projects", path: "/track-projects" },
        ...commonLinks
      ];
    }

    // Links for freelancers/students
    if (isFreelancer) {
      return [
        { name: "Student Dashboard", path: "/dashboard/freelancer" },
        { name: "Browse Projects", path: "/projects" },
        ...commonLinks
      ];
    }

    // Default links if role is undefined
    return [
      { name: "Dashboard", path: "/dashboard" },
      ...commonLinks
    ];
  };

  const navigationLinks = getNavigationLinks();

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
          {navigationLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "font-medium transition-colors hover:text-skill-primary",
                  isActive ? "text-skill-primary" : "text-foreground"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[150px] justify-between">
                    <span className="truncate">
                      {isAdmin ? "Administrator" : profile?.full_name || "User"}
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {isAdmin ? "Admin Account" : isClient ? "Client Account" : isFreelancer ? "Student Account" : "User Account"}
                  </div>
                  <DropdownMenuSeparator />
                  {!isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/edit-profile" className="cursor-pointer">
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
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
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="mr-2">
                  <User size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-semibold">
                  {isAdmin ? "Administrator" : profile?.full_name || "User"}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {isAdmin ? "Admin Account" : isClient ? "Client Account" : isFreelancer ? "Student Account" : "User Account"}
                </div>
                <DropdownMenuSeparator />
                {!isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/edit-profile" className="cursor-pointer">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "py-2 font-medium transition-colors hover:text-skill-primary",
                    isActive ? "text-skill-primary" : "text-foreground"
                  )
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            
            {!user && (
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
