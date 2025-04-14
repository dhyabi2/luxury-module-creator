
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Configure CORS headers to allow all origins
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Default gender options that will always be included
const DEFAULT_GENDERS = [
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'unisex', name: 'Unisex' }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:filters] Handling CORS preflight request with completely unrestricted access');
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
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
    const { data, error } = await supabase
      .from('filters')
      .select('data')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('[API:filters] Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      console.error('[API:filters] No filter data found');
      throw new Error('No filter data found');
    }
    
    console.log('[API:filters] Filters data retrieved successfully');
    console.log('[API:filters] Response structure:', Object.keys(data.data));
    
    // Create a copy of the data to modify
    const responseData = { ...data.data };
    
    // Always ensure genders key exists with default values
    responseData.genders = DEFAULT_GENDERS;
    
    console.log('[API:filters] Ensuring gender data is available');
    
    // Return the response with proper CORS headers
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('[API:filters] Error processing request:', error);
    
    // Even in error case, return default filters with genders
    const defaultResponse = {
      categories: [],
      brands: [],
      bands: [],
      colors: [],
      caseColors: [],
      priceRange: { min: 0, max: 1000, unit: 'OMR' },
      caseSizeRange: { min: 20, max: 45, unit: 'mm' },
      genders: DEFAULT_GENDERS
    };
    
    return new Response(JSON.stringify(defaultResponse), {
      status: 200, // Return 200 even for errors to prevent client retries
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
