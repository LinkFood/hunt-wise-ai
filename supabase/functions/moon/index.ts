import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

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
    const date = url.pathname.split("/")[2] || new Date().toISOString().split("T")[0];
    
    console.log(`Fetching moon phase for date: ${date}`);
    
    const res = await fetch(`https://api.usno.navy.mil/moon/phase?date=${date}`);
    const data = await res.json();
    
    const moonData = { 
      phase: data.phasedata[0].phase, 
      illumination: data.phasedata[0].illumination,
      date: date,
      lastUpdated: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(moonData), {
      headers: { ...corsHeaders, "content-type": "application/json" },
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