import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonPhase } from "@/components/MoonPhase";
import { ZipInput } from "@/components/ZipInput";
import Dashboard from "./Dashboard";

const Index = () => {
  const [zipCode, setZipCode] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState(false);

  const handleZipSubmit = (zip: string) => {
    setZipCode(zip);
    setShowDashboard(true);
  };

  if (showDashboard && zipCode) {
    return <Dashboard zipCode={zipCode} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-card border-border shadow-tactical">
          <CardHeader className="text-center space-y-6">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Hunting Sidekick
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Unleash AI to Hunt with You
              </CardDescription>
            </div>
            
            {/* Moon Phase Display */}
            <div className="flex justify-center">
              <MoonPhase 
                phase="Waxing Crescent" 
                illumination={12}
                className="justify-center"
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ZipInput onSubmit={handleZipSubmit} />
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Get personalized hunting intel for your area
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-card/50 rounded-lg border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-1">AI Intel</h3>
            <p className="text-xs text-muted-foreground">Weather, regs, predictions</p>
          </div>
          <div className="p-4 bg-card/50 rounded-lg border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-1">Find Leases</h3>
            <p className="text-xs text-muted-foreground">Combat rising land costs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
