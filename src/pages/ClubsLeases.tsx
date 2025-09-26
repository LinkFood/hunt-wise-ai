import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, MapPin, DollarSign, CheckCircle, Search, Filter } from "lucide-react";

interface ClubLease {
  id: string;
  name: string;
  zip_code: string;
  type: string;
  description?: string;
  cost_estimate?: number;
  is_verified: boolean;
  join_policy?: string;
  created_at: string;
}

const ClubsLeases = () => {
  const [clubsLeases, setClubsLeases] = useState<ClubLease[]>([]);
  const [filteredData, setFilteredData] = useState<ClubLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchZip, setSearchZip] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [maxBudget, setMaxBudget] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchClubsLeases();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchZip, filterType, maxBudget, clubsLeases]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchClubsLeases = async () => {
    try {
      const { data, error } = await supabase
        .from("clubs_leases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClubsLeases(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load clubs and leases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...clubsLeases];

    // Filter by ZIP code
    if (searchZip) {
      filtered = filtered.filter(item => 
        item.zip_code.includes(searchZip)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(item => 
        item.type.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    // Filter by budget
    if (maxBudget) {
      const budget = parseFloat(maxBudget);
      filtered = filtered.filter(item => 
        !item.cost_estimate || item.cost_estimate <= budget
      );
    }

    setFilteredData(filtered);
  };

  const handleJoinRequest = async (clubId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join clubs or leases",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("join_requests")
        .insert({
          user_id: user.id,
          club_id: clubId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Sent",
        description: "Your join request has been submitted!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading clubs and leases...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Clubs & Leases
          </h1>
          <p className="text-muted-foreground">Find hunting opportunities and combat rising land costs</p>
        </div>

        {/* AI Match Section */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-center">AI Lease Matching</CardTitle>
            <CardDescription className="text-center">
              Get personalized lease recommendations based on your budget and location
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-muted/20 rounded-lg p-6">
              <Search className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                AI-powered lease matching coming soon! Combat $3k-5k/acre land costs with smart recommendations.
              </p>
              <Button variant="outline" disabled>
                Enable AI Matching (Premium)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input
                  placeholder="Enter ZIP"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="club">Club</SelectItem>
                    <SelectItem value="guide">Guide Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Budget ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 2000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* X Buzz Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Local Club Buzz</CardTitle>
            <CardDescription>Recent social media activity about hunting clubs in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">
                X (Twitter) buzz integration coming soon! Get real-time insights on local hunting communities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredData.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new listings.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <Card key={item.id} className="bg-card border-border shadow-card hover:shadow-tactical transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.name}
                        {item.is_verified && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        ZIP {item.zip_code}
                      </CardDescription>
                    </div>
                    <Badge variant={item.type === 'lease' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {item.cost_estimate && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          ${item.cost_estimate.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {item.join_policy && (
                      <div className="text-xs text-muted-foreground">
                        Policy: {item.join_policy}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handleJoinRequest(item.id)}
                    className="w-full"
                    variant={user ? "default" : "outline"}
                  >
                    {user ? "Request to Join" : "Sign In to Join"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsLeases;