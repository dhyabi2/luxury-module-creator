
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:navigation] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Log request details
  console.log('[API:navigation] Request received from:', req.headers.get('origin') || 'unknown origin');
  console.log('[API:navigation] Request method:', req.method);
  
  try {
    // For demo purposes, we'll return hardcoded navigation data
    // In a real implementation, this would come from the database
    console.log('[API:navigation] Returning hardcoded navigation data');
    
    const navigationData = {
      mainCategories: [
        { id: 'women', name: 'WOMEN', active: true },
        { id: 'men', name: 'MEN', active: false },
        { id: 'new-in', name: 'NEW IN', active: false },
        { id: 'sale', name: 'SALE', active: false }
      ],
      secondaryCategories: [
        { id: 'new-in', name: 'NEW IN' },
        { id: 'sale', name: 'SALE' },
        { id: 'brands', name: 'BRANDS' },
        { id: 'watches', name: 'WATCHES' },
        { id: 'jewellery', name: 'JEWELLERY' },
        { id: 'accessories', name: 'ACCESSORIES' },
        { id: 'bags', name: 'BAGS' },
        { id: 'perfumes', name: 'PERFUMES' },
        { id: 'stores', name: 'STORE LOCATOR', highlight: true }
      ]
    };
    
    // Return the response
    return new Response(JSON.stringify(navigationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API:navigation] Error processing request:', error);
    console.error('[API:navigation] Error details:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
