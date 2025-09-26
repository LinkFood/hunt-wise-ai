import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Camera, Share, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Trophy {
  id: string;
  species: string;
  kill_date: string;
  zip_code: string;
  photo_url?: string;
  description?: string;
  created_at: string;
}

const TrophyLogbook = () => {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    species: "",
    kill_date: "",
    zip_code: "",
    description: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchTrophies();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const fetchTrophies = async () => {
    try {
      const { data, error } = await supabase
        .from("trophies")
        .select("*")
        .order("kill_date", { ascending: false });

      if (error) throw error;
      setTrophies(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load trophies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("trophies")
        .insert({
          ...formData,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trophy logged successfully!",
      });

      setFormData({ species: "", kill_date: "", zip_code: "", description: "" });
      setShowForm(false);
      fetchTrophies();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const shareToX = (trophy: Trophy) => {
    const text = `Just logged a ${trophy.species} harvest! 🎯 #hunting #trophy #huntwise`;
    const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = (trophy: Trophy) => {
    const text = `Just logged a ${trophy.species} harvest!`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading your trophy room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              Trophy Logbook
            </h1>
            <p className="text-muted-foreground">Log and share your hunting achievements</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            {showForm ? "Cancel" : "Log New Trophy"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Log New Trophy</CardTitle>
              <CardDescription>Record details of your latest harvest</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="species">Species</Label>
                    <Input
                      id="species"
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                      placeholder="e.g., White-tail Deer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kill_date">Kill Date</Label>
                    <Input
                      id="kill_date"
                      type="date"
                      value={formData.kill_date}
                      onChange={(e) => setFormData({...formData, kill_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5)})}
                    placeholder="12345"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell the story of your hunt..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Log Trophy
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Trophy Grid */}
        {trophies.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Trophies Yet</h3>
              <p className="text-muted-foreground mb-4">Start logging your hunting achievements!</p>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
                Log First Trophy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trophies.map((trophy) => (
              <Card key={trophy.id} className="bg-card border-border shadow-card hover:shadow-tactical transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trophy.species}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trophy.kill_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trophy.zip_code}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {trophy.photo_url ? (
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted/50 rounded-lg mb-3 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {trophy.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {trophy.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-muted-foreground mb-3">
                    <Badge variant="secondary">
                      AI Score: Calculating...
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => shareToX(trophy)}
                      className="flex-1"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      X
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => shareToFacebook(trophy)}
                      className="flex-1"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      FB
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrophyLogbook;