import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { 
  Brain, 
  Users, 
  Trophy, 
  MessageCircle, 
  Crown,
  CloudRain,
  Moon,
  Scale,
  Target,
  LogOut,
  Mic,
  ExternalLink,
  Calendar,
  Upload,
  Activity
} from "lucide-react";
import { MoonPhase } from "@/components/MoonPhase";

interface DashboardProps {
  zipCode: string;
}

interface MoonData {
  phase: string;
  illumination: number;
  date?: string;
  error?: string;
}

interface PredictionData {
  gameActivityScore: number;
  activityLevel: string;
  confidence: number;
  factors?: any;
  predictions?: any;
  recommendations?: string[];
  error?: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  huntingConditions: string;
  error?: string;
}

const Dashboard = ({ zipCode }: DashboardProps) => {
  const [moonData, setMoonData] = useState<MoonData>({
    phase: "Loading...",
    illumination: 0
  });
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Trophy form state
  const [trophyForm, setTrophyForm] = useState({
    species: '',
    killDate: '',
    description: ''
  });

  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch AI data on component mount
  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      try {
        // Parallel API calls for efficiency
        const [moonResponse, predictionResponse, weatherResponse] = await Promise.all([
          supabase.functions.invoke('moon', { 
            body: { date: today }
          }),
          supabase.functions.invoke('predict', { 
            body: { zipCode, date: today }
          }),
          supabase.functions.invoke('weather', { 
            body: { zipCode }
          })
        ]);

        // Process moon data
        if (moonResponse.data) {
          setMoonData({
            phase: moonResponse.data.phase || "Waxing Crescent",
            illumination: moonResponse.data.illumination || 12,
            date: moonResponse.data.date
          });
        } else if (moonResponse.error) {
          console.error('Moon API error:', moonResponse.error);
          setMoonData({
            phase: "Waxing Crescent", 
            illumination: 12,
            error: 'Unable to load moon data'
          });
        }

        // Process prediction data  
        if (predictionResponse.data) {
          setPredictionData(predictionResponse.data);
        } else if (predictionResponse.error) {
          console.error('Prediction API error:', predictionResponse.error);
          setPredictionData({
            gameActivityScore: 65,
            activityLevel: 'Moderate',
            confidence: 75,
            error: 'Using fallback predictions'
          });
        }

        // Process weather data
        if (weatherResponse.data) {
          setWeatherData(weatherResponse.data);
        } else if (weatherResponse.error) {
          console.error('Weather API error:', weatherResponse.error);
          setWeatherData({
            temperature: 45,
            condition: 'Partly Cloudy',
            huntingConditions: 'Fair',
            error: 'Weather data unavailable'
          });
        }

      } catch (error) {
        console.error('Failed to fetch AI data:', error);
        toast({
          title: "API Error",
          description: "Some AI features may not be available. Using cached data.",
          variant: "destructive"
        });
        
        // Set fallback data
        setMoonData({ phase: "Waxing Crescent", illumination: 12 });
        setPredictionData({
          gameActivityScore: 65,
          activityLevel: 'Moderate', 
          confidence: 75
        });
        setWeatherData({
          temperature: 45,
          condition: 'Partly Cloudy',
          huntingConditions: 'Fair'
        });
      } finally {
        setLoading(false);
      }
    };

    if (zipCode && zipCode.length === 5) {
      fetchAIData();
    }
  }, [zipCode, toast]);

  const handleTrophySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to log trophies.",
        variant: "destructive"
      });
      return;
    }

    if (!trophyForm.species || !trophyForm.killDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in species and kill date.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('trophies')
        .insert([
          {
            user_id: user.id,
            species: trophyForm.species,
            kill_date: trophyForm.killDate,
            zip_code: zipCode,
            description: trophyForm.description
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Trophy logged successfully!"
      });

      // Reset form
      setTrophyForm({
        species: '',
        killDate: '',
        description: ''
      });

    } catch (error) {
      console.error('Error logging trophy:', error);
      toast({
        title: "Error",
        description: "Failed to log trophy. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  // Show loading state while auth or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          <div className="text-foreground">Loading Hunt Wise AI...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hunt Wise AI</h1>
            <p className="text-muted-foreground">ZIP: {zipCode}</p>
            {user && (
              <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Pro
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>

        {/* AI Briefing Card */}
        <Card className="bg-card border-border shadow-card" style={{ height: '300px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Hunt Briefing
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Live</Badge>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full bg-muted/50">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Moon Phase */}
            <MoonPhase 
              phase={moonData.phase} 
              illumination={moonData.illumination}
              className="mb-3"
            />
            
            {/* Prediction Score */}
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Game Activity</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {predictionData ? `${predictionData.gameActivityScore}%` : 'Loading...'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {predictionData 
                  ? `${predictionData.gameActivityScore}% activity chance at dusk - ${predictionData.activityLevel} conditions`
                  : 'Analyzing hunting patterns...'
                }
              </p>
            </div>

            {/* Weather & Conditions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <CloudRain className="w-4 h-4 text-primary" />
                <div className="text-xs">
                  <div className="font-medium">Weather</div>
                  <div className="text-muted-foreground">
                    {weatherData ? `${weatherData.temperature}°F` : 'Loading...'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <Target className="w-4 h-4 text-primary" />
                <div className="text-xs">
                  <div className="font-medium">Conditions</div>
                  <div className="text-muted-foreground">
                    {weatherData?.huntingConditions || 'Analyzing...'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clubs & Leases Card */}
        <Card className="bg-card border-border shadow-card" style={{ height: '300px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-primary" />
              Clubs & Leases
            </CardTitle>
            <CardDescription>Find hunting opportunities near you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Elk lease, $2k</p>
                  <p className="text-xs text-muted-foreground">ZIP {zipCode} • 500 acres</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  style={{ backgroundColor: '#228B22' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7b1e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#228B22'}
                >
                  Join
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Deer Club - $1,200</p>
                  <p className="text-xs text-muted-foreground">Members only • Bow season</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  style={{ backgroundColor: '#228B22' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7b1e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#228B22'}
                >
                  Join
                </Button>
              </div>
            </div>
            
            <Link to="/clubs-leases" className="block">
              <Button variant="outline" className="w-full mt-4">
                Browse All Leases
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Trophy Room Card */}
        <Card className="bg-card border-border shadow-card" style={{ height: '300px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-primary" />
              Trophy Room
            </CardTitle>
            <CardDescription>Log your hunting success</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrophySubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Species (e.g., Whitetail)"
                  value={trophyForm.species}
                  onChange={(e) => setTrophyForm(prev => ({ ...prev, species: e.target.value }))}
                  className="bg-muted/30"
                />
                <Input
                  type="date"
                  value={trophyForm.killDate}
                  onChange={(e) => setTrophyForm(prev => ({ ...prev, killDate: e.target.value }))}
                  className="bg-muted/30"
                />
              </div>
              <Input
                placeholder="ZIP Code"
                value={zipCode}
                disabled
                className="bg-muted/50"
              />
              <Textarea
                placeholder="Description (optional)"
                value={trophyForm.description}
                onChange={(e) => setTrophyForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-muted/30 resize-none"
                rows={2}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={!user || !trophyForm.species || !trophyForm.killDate}
              >
                {user ? 'Log Hunt' : 'Sign In to Log'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Chat Card */}
        <Card className="bg-card border-border shadow-card" style={{ height: '300px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageCircle className="w-5 h-5 text-primary" />
              Local Chat
            </CardTitle>
            <CardDescription>Recent posts for ZIP {zipCode}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm">Recent hunting activity reported in your area...</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm">Good elk sign spotted near the north ridge</p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="readonly" 
                  defaultChecked 
                  className="rounded"
                />
                <label htmlFor="readonly" className="text-xs text-muted-foreground">
                  Read-only
                </label>
              </div>
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            
            <Input
              placeholder="Share hunting intel..."
              disabled={!user}
              className="bg-muted/30"
            />
            
            <Link to="/chat" className="block">
              <Button variant="outline" className="w-full">
                Join Full Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Navigation Footer */}
        <div className="flex justify-center pt-4">
          <div className="flex gap-2 bg-card/50 p-2 rounded-lg">
            <Link to="/trophies">
              <Button variant="ghost" size="sm" className="gap-2">
                <Trophy className="w-4 h-4" />
                Trophies
              </Button>
            </Link>
            <Link to="/clubs-leases">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Clubs
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;