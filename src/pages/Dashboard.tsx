import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Users, 
  Trophy, 
  MessageCircle, 
  Crown,
  CloudRain,
  Moon,
  Scale,
  Target
} from "lucide-react";
import { MoonPhase } from "@/components/MoonPhase";

interface DashboardProps {
  zipCode: string;
}

const Dashboard = ({ zipCode }: DashboardProps) => {
  const [currentMoonPhase] = useState({
    phase: "Waxing Crescent",
    illumination: 12
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hunt Intel</h1>
            <p className="text-muted-foreground">ZIP: {zipCode}</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </Button>
        </div>

        {/* AI Briefing Card */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="w-5 h-5 text-primary" />
              AI Hunt Briefing
              <Badge variant="outline" className="ml-auto">Live Intel</Badge>
            </CardTitle>
            <CardDescription>Real-time hunting intelligence for {zipCode}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <CloudRain className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Weather</p>
                  <p className="text-sm text-muted-foreground">Fetching conditions...</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Scale className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Regulations</p>
                  <p className="text-sm text-muted-foreground">Loading seasons...</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Game Activity</p>
                  <p className="text-sm text-muted-foreground">Analyzing patterns...</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <MoonPhase 
                phase={currentMoonPhase.phase} 
                illumination={currentMoonPhase.illumination}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                Optimal hunting conditions expected during early morning hours. 
                Game activity predicted to be high near feeding areas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Clubs & Leases */}
          <Card className="bg-card border-border shadow-card hover:shadow-tactical transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                Clubs & Leases
              </CardTitle>
              <CardDescription>Find hunting opportunities near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium text-sm">Elk Lease - $2,000</p>
                  <p className="text-xs text-muted-foreground">Private ranch, 500 acres</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="font-medium text-sm">Deer Club - $1,200</p>
                  <p className="text-xs text-muted-foreground">Members only, bow season</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Browse All
              </Button>
            </CardContent>
          </Card>

          {/* Trophy Room */}
          <Card className="bg-card border-border shadow-card hover:shadow-tactical transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="w-5 h-5 text-primary" />
                Trophy Room
              </CardTitle>
              <CardDescription>Log and share your harvests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No trophies logged yet</p>
              </div>
              <Button variant="default" className="w-full">
                Log New Trophy
              </Button>
            </CardContent>
          </Card>

          {/* Chat Rooms */}
          <Card className="bg-card border-border shadow-card hover:shadow-tactical transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                Local Chat
              </CardTitle>
              <CardDescription>Connect with hunters in {zipCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-secondary/20 rounded text-muted-foreground">
                  <p>Recent activity in your area...</p>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Read-only mode</span>
                  <Badge variant="outline">Live</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Join Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;