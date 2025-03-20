
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:product-detail] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse URL to extract product ID
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  console.log(`[API:product-detail] Request received from: ${req.headers.get('origin') || 'unknown origin'}`);
  console.log(`[API:product-detail] Request method: ${req.method}`);
  console.log(`[API:product-detail] Product ID requested: ${productId}`);

  if (!productId) {
    console.error('[API:product-detail] No product ID provided');
    return new Response(JSON.stringify({ error: 'Product ID is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Query the database for the product
    console.log(`[API:product-detail] Querying database for product ID: ${productId}`);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();
    
    if (error) {
      console.error(`[API:product-detail] Database error:`, error);
      console.error(`[API:product-detail] Error details: ${error.message}`);
      throw error;
    }
    
    if (!data) {
      console.error(`[API:product-detail] Product with ID ${productId} not found`);
      return new Response(JSON.stringify({ error: `Product with ID ${productId} not found` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate image URL
    if (!data.image || !data.image.startsWith('http')) {
      console.log(`[API:product-detail] Product ID ${productId} has invalid image URL, using fallback`);
      data.image = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8';
    }

    console.log(`[API:product-detail] Successfully retrieved product data for ID: ${productId}`);
    
    return new Response(JSON.stringify({ product: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API:product-detail] Error processing request:', error);
    console.error('[API:product-detail] Error details:', error.message);
    if (error.stack) {
      console.error('[API:product-detail] Stack trace:', error.stack);
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
