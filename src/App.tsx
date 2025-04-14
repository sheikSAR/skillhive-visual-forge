
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Projects from "@/pages/Projects";
import Apply from "@/pages/Apply";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import NotFound from "@/pages/NotFound";
import FreelancerDashboard from "@/pages/Dashboard/FreelancerDashboard";
import ClientDashboard from "@/pages/Dashboard/ClientDashboard";

// Layout Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
