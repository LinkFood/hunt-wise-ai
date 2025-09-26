import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation for ZIP code
const validateZipCode = (zip: string): boolean => {
  return /^\d{5}$/.test(zip);
};

// Simulate hunting buzz/chatter data for an area
const generateHuntingBuzz = async (zipCode: string) => {
  try {
    // Get location info
    const geocodeRes = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    const geocodeData = await geocodeRes.json();
    const city = geocodeData.places[0]['place name'];
    const state = geocodeData.places[0]['state abbreviation'];
    
    // Generate realistic hunting buzz data
    const buzzTopics = [
      'deer sightings',
      'turkey activity',
      'hunting pressure',
      'access permissions', 
      'weather conditions',
      'equipment recommendations',
      'best hunting spots',
      'hunting regulations',
      'season updates',
      'success stories'
    ];
    
    const samplePosts = [
      `Saw a nice 8-point buck near ${city} yesterday morning around 6:30 AM. Movement picking up!`,
      `Turkey activity increasing in ${state}. Heard multiple gobblers this week in the area.`,
      `Hunting pressure seems lighter this year around ${city}. Good opportunities for patient hunters.`,
      `Weather looking perfect for the weekend hunt. High pressure system moving in.`,
      `Found fresh deer sign along the creek bottoms near ${city}. Worth checking out.`,
      `Local hunting club has openings for ${state} residents. PM for details.`,
      `Bow season has been productive. Several successful hunts reported in the area.`,
      `Trail cam photos showing increased deer movement at dawn and dusk.`,
      `New hunting regulations for ${state} posted. Check before your next trip.`,
      `Best hunting spots in ${city} area seem to be the oak ridges and creek bottoms.`
    ];
    
    const sentiments = ['positive', 'neutral', 'negative', 'excited', 'informative'];
    const sources = ['Facebook Groups', 'Hunting Forums', 'Local Clubs', 'Trail Cam Networks', 'Hunting Apps'];
    
    // Generate 5-10 recent "posts"
    const numPosts = Math.floor(Math.random() * 6) + 5;
    const recentPosts = [];
    
    for (let i = 0; i < numPosts; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const postDate = new Date();
      postDate.setDate(postDate.getDate() - daysAgo);
      
      recentPosts.push({
        id: `buzz_${Date.now()}_${i}`,
        content: samplePosts[Math.floor(Math.random() * samplePosts.length)],
        topic: buzzTopics[Math.floor(Math.random() * buzzTopics.length)],
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        engagement: Math.floor(Math.random() * 50) + 5, // 5-55 interactions
        timestamp: postDate.toISOString(),
        location: `${city}, ${state}`
      });
    }
    
    // Sort by most recent
    recentPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Generate activity summary
    const activityLevel = Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Low';
    const trendingTopics = buzzTopics.slice(0, 3).sort(() => Math.random() - 0.5);
    
    return {
      zipCode,
      location: `${city}, ${state}`,
      activityLevel,
      totalPosts: recentPosts.length,
      trendingTopics,
      recentPosts,
      summary: {
        positivePostsPercent: Math.floor(Math.random() * 40) + 40, // 40-80%
        mostDiscussedTopic: trendingTopics[0],
        peakActivityHour: Math.floor(Math.random() * 12) + 6, // 6 AM - 6 PM
        averageEngagement: Math.floor(recentPosts.reduce((sum, post) => sum + post.engagement, 0) / recentPosts.length)
      },
      insights: [
        `${activityLevel} hunting discussion activity in the ${city} area`,
        `Most hunters are talking about ${trendingTopics[0]} this week`,
        recentPosts.length > 8 ? 'Very active hunting community' : 'Moderate hunting community engagement',
        'Check local hunting forums and Facebook groups for real-time updates'
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    // Fallback data if API calls fail
    return {
      zipCode,
      location: 'Unknown Area',
      activityLevel: 'Moderate',
      totalPosts: 5,
      recentPosts: [
        {
          id: 'fallback_1',
          content: 'General hunting activity reported in the area this week.',
          topic: 'hunting activity',
          sentiment: 'neutral',
          source: 'Local Reports',
          engagement: 15,
          timestamp: new Date().toISOString(),
          location: 'Local Area'
        }
      ],
      summary: {
        positivePostsPercent: 60,
        mostDiscussedTopic: 'deer sightings',
        peakActivityHour: 7,
        averageEngagement: 15
      },
      error: 'Limited data available',
      lastUpdated: new Date().toISOString()
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const zipCode = url.pathname.split('/').pop();

    // Input validation
    if (!zipCode || !validateZipCode(zipCode)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid ZIP code format. Must be 5 digits.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching hunting buzz for ZIP: ${zipCode}`);

    const buzzData = await generateHuntingBuzz(zipCode);

    return new Response(JSON.stringify(buzzData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in buzz function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});