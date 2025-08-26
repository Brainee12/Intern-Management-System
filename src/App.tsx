import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";

// Pages
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import InternLogin from "./pages/InternLogin";
import InternSignup from "./pages/InternSignup";
import InternDashboard from "./pages/InternDashboard";
import SQLSchema from "./pages/SQLSchema";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/intern-login" element={<InternLogin />} />
            <Route path="/intern-signup" element={<InternSignup />} />
            <Route path="/intern-dashboard" element={<InternDashboard />} />
            <Route path="/database-schema" element={<SQLSchema />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
