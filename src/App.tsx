import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrophyLogbook from "./pages/TrophyLogbook";
import ClubsLeases from "./pages/ClubsLeases";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dashboard wrapper to extract ZIP from query params
const DashboardWrapper = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get('zip') || '12345'; // fallback ZIP
  return <Dashboard zipCode={zipCode} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/trophies" element={<TrophyLogbook />} />
            <Route path="/clubs-leases" element={<ClubsLeases />} />
            <Route path="/chat" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
