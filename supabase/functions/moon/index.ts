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
    const dateParam = url.pathname.split('/').pop() || new Date().toISOString().split('T')[0];

    console.log(`Fetching moon phase for date: ${dateParam}`);

    // Mock moon phase data - in production, integrate with USNO API
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const randomPhase = phases[Math.floor(Math.random() * phases.length)];
    const illumination = Math.floor(Math.random() * 100);

    const mockMoonData = {
      date: dateParam,
      phase: randomPhase,
      illumination,
      moonrise: '18:30',
      moonset: '06:15',
      huntingImpact: illumination > 75 ? 'Reduced night activity' : illumination < 25 ? 'Increased dawn/dusk activity' : 'Normal activity patterns',
      optimalTimes: ['05:30-07:00', '17:30-19:00'],
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(mockMoonData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in moon function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});