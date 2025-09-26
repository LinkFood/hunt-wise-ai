import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, MapPin, Clock, Share, Shield } from "lucide-react";

interface ChatPost {
  id: string;
  user_id: string;
  zip_code: string;
  content: string;
  created_at: string;
  expires_at: string;
  profiles?: {
    name?: string;
  };
}

const Chat = () => {
  const [posts, setPosts] = useState<ChatPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [newPost, setNewPost] = useState("");
  const [readOnly, setReadOnly] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchPosts();
  }, [zipCode]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("chat_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Filter by ZIP code if provided
      if (zipCode) {
        query = query.eq("zip_code", zipCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load chat posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim() || !zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and sign in to post",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("chat_posts")
        .insert({
          user_id: user.id,
          zip_code: zipCode,
          content: newPost.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your message has been posted!",
      });

      setNewPost("");
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const shareToX = (post: ChatPost) => {
    const text = `Check out this hunting discussion in ZIP ${post.zip_code} #huntwise #hunting`;
    const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = (post: ChatPost) => {
    const text = `Hunting discussion in ZIP ${post.zip_code}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8 text-primary" />
            Local Chat Rooms
          </h1>
          <p className="text-muted-foreground">Connect with hunters in your area</p>
        </div>

        {/* Controls */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Chat Settings</CardTitle>
            <CardDescription>Configure your chat experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip-filter">Filter by ZIP Code</Label>
                <Input
                  id="zip-filter"
                  placeholder="Enter ZIP to filter"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Read-Only Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable to browse without posting</p>
                </div>
                <Switch 
                  checked={readOnly} 
                  onCheckedChange={setReadOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Moderation Notice */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">AI Moderated Chat</p>
                <p className="text-xs text-muted-foreground">
                  Posts are automatically moderated for safety. Messages expire after 90 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Form */}
        {!readOnly && user && (
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Share with Your Local Community</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="post-zip">Your ZIP Code</Label>
                  <Input
                    id="post-zip"
                    placeholder="12345"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-content">Message</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Share hunting tips, ask questions, or connect with fellow hunters..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {newPost.length}/500 characters
                  </p>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Post Message
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Auth Prompt */}
        {!readOnly && !user && (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-2">Join the Conversation</h3>
              <p className="text-muted-foreground mb-4">Sign in to post messages and connect with local hunters</p>
              <Button variant="outline">
                Sign In to Chat
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Chat Posts */}
        <div className="space-y-4">
          {loading ? (
            <Card className="bg-card border-border">
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">Loading chat posts...</div>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">
                  {zipCode 
                    ? `No messages found for ZIP ${zipCode}. Be the first to start the conversation!`
                    : "Enter a ZIP code to view local conversations"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.zip_code}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Anonymous Hunter
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(post.created_at)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-foreground mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => shareToX(post)}
                      >
                        <Share className="w-3 h-3 mr-1" />
                        Share on X
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => shareToFacebook(post)}
                      >
                        <Share className="w-3 h-3 mr-1" />
                        Share on FB
                      </Button>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Expires {formatTimeAgo(post.expires_at)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;