
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse URL and query parameters
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || '';
  
  console.log('[API:filters] Request parameters:', {
    category: category || 'not set'
  });
  
  try {
    // Fetch filters directly from Supabase
    console.log('[API:filters] Fetching filters from Supabase');
    const { data, error } = await supabase.from('filters').select('data').eq('id', 1).single();
    
    if (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
    
    console.log('[API:filters] Filters data retrieved successfully');
    
    return new Response(JSON.stringify(data.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in filters function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
