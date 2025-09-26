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
    const zipCode = url.pathname.split('/').pop();

    console.log(`Fetching weather for ZIP: ${zipCode}`);

    // Mock weather data - in production, integrate with NOAA API
    const mockWeatherData = {
      zipCode,
      temperature: Math.floor(Math.random() * 30) + 20, // 20-50°F
      pressure: (29.5 + Math.random() * 1).toFixed(2), // 29.5-30.5 inHg
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      condition: ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
      huntingConditions: 'Favorable',
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(mockWeatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});