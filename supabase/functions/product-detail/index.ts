
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Completely open CORS headers - no restrictions at all
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
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

  // Extract product ID from the URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];
  
  if (!productId) {
    console.error('[API:product-detail] Missing product ID in request');
    return new Response(
      JSON.stringify({ error: 'Product ID is required' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  console.log(`[API:product-detail] Request received for product: ${productId}`);
  
  try {
    // Fetch the product from Supabase
    console.log(`[API:product-detail] Querying database for product ID: ${productId}`);
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('[API:product-detail] Database error:', error);
      throw error;
    }
    
    if (!product) {
      console.error('[API:product-detail] Product not found:', productId);
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('[API:product-detail] Product found, returning data');
    
    // Process the product (validate image URL, etc.)
    if (!product.image || !product.image.startsWith('http')) {
      product.image = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8';
    }
    
    // Return the direct response with CORS headers
    return new Response(
      JSON.stringify(product),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[API:product-detail] Error processing request:', error);
    console.error('[API:product-detail] Error details:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
