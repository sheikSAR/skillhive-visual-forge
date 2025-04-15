
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

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
import EditProfile from "@/pages/EditProfile";
import PostProject from "@/pages/PostProject";
import TrackProjects from "@/pages/TrackProjects";
import AdminDashboard from "@/pages/Admin/AdminDashboard";

// Layout Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

// Private route component to protect dashboard routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin route component to protect admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

// Dashboard router that redirects to the appropriate dashboard
const DashboardRouter = () => {
  const { isFreelancer, isClient, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  } else if (isFreelancer) {
    return <Navigate to="/dashboard/freelancer" replace />;
  } else if (isClient) {
    return <Navigate to="/dashboard/client" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

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
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Profile routes */}
              <Route path="/edit-profile" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } />
              
              {/* Client routes */}
              <Route path="/post-project" element={
                <PrivateRoute>
                  <PostProject />
                </PrivateRoute>
              } />
              <Route path="/track-projects" element={
                <PrivateRoute>
                  <TrackProjects />
                </PrivateRoute>
              } />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/freelancer" element={
                <PrivateRoute>
                  <FreelancerDashboard />
                </PrivateRoute>
              } />
              <Route path="/dashboard/client" element={
                <PrivateRoute>
                  <ClientDashboard />
                </PrivateRoute>
              } />
              
              {/* Catch-all route */}
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
