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
    let date = new Date().toISOString().split("T")[0];
    
    // Handle both URL path and POST body methods
    if (req.method === 'POST') {
      const body = await req.json();
      if (body?.date) {
        date = body.date;
      }
    } else {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(part => part);
      if (pathParts.length > 1) {
        date = pathParts[pathParts.length - 1] || date;
      }
    }
    
    console.log(`Fetching moon phase for date: ${date}`);
    
    try {
      const res = await fetch(`https://api.usno.navy.mil/moon/phase?date=${date}`);
      if (!res.ok) {
        throw new Error(`Moon API responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data?.phasedata?.[0]) {
        const moonData = { 
          phase: data.phasedata[0].phase || "Waxing Crescent", 
          illumination: data.phasedata[0].illumination || 12,
          date: date,
          lastUpdated: new Date().toISOString(),
          source: 'USNO API'
        };
        
        return new Response(JSON.stringify(moonData), {
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      } else {
        throw new Error("Invalid moon phase data received");
      }
    } catch (apiError) {
      console.log("Moon API unavailable, using enhanced fallback data:", apiError);
      
      // Enhanced fallback with seasonal moon phase simulation
      const now = new Date();
      const dayOfMonth = now.getDate();
      const phases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Third Quarter", "Waning Crescent"];
      const phaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
      const illumination = Math.round(Math.abs(Math.sin((dayOfMonth / 30) * Math.PI)) * 100);
      
      const fallbackData = {
        phase: phases[phaseIndex] || "Waxing Crescent",
        illumination: illumination || 12,
        date: date,
        lastUpdated: new Date().toISOString(),
        fallback: true,
        source: 'Hunt Wet Simulation'
      };
      
      return new Response(JSON.stringify(fallbackData), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
  } catch (error: unknown) {
    console.error('Error in moon function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      phase: "Waxing Crescent",
      illumination: 12,
      fallback: true,
      source: 'Hunt Wet Emergency Fallback'
    }), {
      status: 200, // Return 200 with fallback data instead of error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});