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

    console.log(`Fetching regulations for ZIP: ${zipCode}`);

    // Mock regulations data - in production, integrate with state wildlife agency APIs
    const mockRegulationsData = {
      zipCode,
      state: 'Sample State',
      seasons: {
        deer: {
          archery: { start: '2024-10-01', end: '2024-10-31' },
          firearm: { start: '2024-11-15', end: '2024-12-15' },
          muzzleloader: { start: '2024-12-20', end: '2024-12-31' }
        },
        turkey: {
          spring: { start: '2024-04-15', end: '2024-05-15' },
          fall: { start: '2024-10-15', end: '2024-11-15' }
        }
      },
      bagLimits: {
        deer: '2 bucks, 4 does',
        turkey: '2 bearded birds'
      },
      licenseRequired: true,
      huntingPermitRequired: true,
      hunterSafetyRequired: true,
      specialZones: [
        'Zone A: Extended archery season',
        'Zone B: Antler point restrictions (4+ points)'
      ],
      lastUpdated: new Date().toISOString(),
      officialSource: 'State Wildlife Agency'
    };

    return new Response(JSON.stringify(mockRegulationsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in regulations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});