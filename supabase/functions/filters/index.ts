
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:filters] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse URL and query parameters
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || '';
  
  console.log('[API:filters] Request received from:', req.headers.get('origin') || 'unknown origin');
  console.log('[API:filters] Request method:', req.method);
  console.log('[API:filters] Request parameters:', {
    category: category || 'not set'
  });
  
  try {
    // Fetch filters directly from Supabase
    console.log('[API:filters] Querying database for filters data');
    const { data, error } = await supabase.from('filters').select('data').eq('id', 1).single();
    
    if (error) {
      console.error('[API:filters] Database error:', error);
      console.error('[API:filters] Error details:', error.message);
      throw error;
    }
    
    console.log('[API:filters] Filters data retrieved successfully');
    console.log('[API:filters] Filter data structure:', {
      categories: Array.isArray(data.data.categories) ? data.data.categories.length : 0,
      brands: Array.isArray(data.data.brands) ? data.data.brands.length : 0,
      bands: Array.isArray(data.data.bands) ? data.data.bands.length : 0,
      priceRange: data.data.priceRange ? `${data.data.priceRange.min}-${data.data.priceRange.max}` : 'not available'
    });
    
    return new Response(JSON.stringify(data.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API:filters] Error processing request:', error);
    console.error('[API:filters] Error details:', error.message);
    if (error.stack) {
      console.error('[API:filters] Stack trace:', error.stack);
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
