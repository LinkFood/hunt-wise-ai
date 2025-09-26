import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const zipCode = pathParts[pathParts.length - 2];
    const date = pathParts[pathParts.length - 1];

    console.log(`Generating prediction for ZIP: ${zipCode}, Date: ${date}`);

    // Mock AI prediction data - in production, use ML models with weather, moon, pressure, etc.
    const activityScore = Math.floor(Math.random() * 100) + 1; // 1-100
    const confidenceLevel = Math.floor(Math.random() * 30) + 70; // 70-100%

    const getActivityLevel = (score: number) => {
      if (score >= 80) return 'Very High';
      if (score >= 60) return 'High';
      if (score >= 40) return 'Moderate';
      if (score >= 20) return 'Low';
      return 'Very Low';
    };

    const mockPredictionData = {
      zipCode,
      date,
      gameActivityScore: activityScore,
      activityLevel: getActivityLevel(activityScore),
      confidence: confidenceLevel,
      factors: {
        weather: Math.random() > 0.5 ? 'Favorable' : 'Challenging',
        moonPhase: Math.random() > 0.5 ? 'Optimal' : 'Suboptimal',
        barometricPressure: Math.random() > 0.5 ? 'Rising' : 'Falling',
        temperature: Math.random() > 0.5 ? 'Ideal' : 'Too warm/cold'
      },
      recommendations: [
        'Best times: 5:30-7:30 AM and 5:00-7:00 PM',
        'Focus on feeding areas near water sources',
        'Use scent control due to favorable wind conditions',
        'Consider elevated stands for better visibility'
      ],
      species: {
        deer: { probability: Math.floor(Math.random() * 100), movement: 'Active during dawn/dusk' },
        turkey: { probability: Math.floor(Math.random() * 100), movement: 'Roosting behavior observed' }
      },
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(mockPredictionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in predict function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});