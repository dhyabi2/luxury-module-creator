
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
    
    // Ensure genders key exists in the data
    if (data.data && !data.data.genders && data.data.genders !== null) {
      console.log('[API:filters] Adding default genders as they were missing');
      data.data.genders = [
        { id: 'men', name: 'Men' },
        { id: 'women', name: 'Women' },
        { id: 'unisex', name: 'Unisex' }
      ];
    }
    
    return new Response(JSON.stringify(data.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API:filters] Error processing request:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
