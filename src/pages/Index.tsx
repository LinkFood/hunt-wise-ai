import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import LandingPage from "@/components/LandingPage";
import Dashboard from "./Dashboard";

const Index = () => {
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const zipFromUrl = searchParams.get('zip');

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // If there's a ZIP code in the URL, show the dashboard
  if (zipFromUrl && zipFromUrl.length === 5) {
    return <Dashboard zipCode={zipFromUrl} />;
  }

  // Otherwise show the landing page
  return <LandingPage />;
};

export default Index;
