
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:products] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse URL and query parameters
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  
  console.log('[API:products] Request received from:', req.headers.get('origin') || 'unknown origin');
  console.log('[API:products] Request method:', req.method);
  console.log('[API:products] Request parameters:', params);
  
  // Extract pagination and filter parameters
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '8');
  
  try {
    // Start building the query
    console.log('[API:products] Building Supabase query with filters');
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (params.brand) {
      const brands = params.brand.split(',');
      console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
      query = query.in('brand', brands);
    }
    
    if (params.category) {
      const categories = params.category.split(',');
      console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
      query = query.in('category', categories);
    }
    
    if (params.minPrice && params.maxPrice) {
      console.log(`[API:products] Filtering by price range: $${params.minPrice} - $${params.maxPrice}`);
      query = query.gte('price', parseFloat(params.minPrice))
                 .lte('price', parseFloat(params.maxPrice));
    }
    
    // Apply sorting
    const sortBy = params.sortBy || 'featured';
    console.log(`[API:products] Sorting by: ${sortBy}`);
    if (sortBy === 'price-low-high') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high-low') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('id', { ascending: false });
    } else {
      // Default sorting (featured)
      query = query.order('id', { ascending: true });
    }
    
    // Execute count query first
    console.log('[API:products] Executing count query');
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error('[API:products] Count query error:', countError);
      throw countError;
    }
    
    console.log(`[API:products] Total products found: ${count}`);
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    console.log(`[API:products] Applying pagination: items ${from} to ${to}`);
    query = query.range(from, to);
    
    // Execute the data query
    console.log('[API:products] Executing data query');
    const { data: products, error } = await query;
    
    if (error) {
      console.error('[API:products] Data query error:', error);
      throw error;
    }
    
    console.log(`[API:products] Retrieved ${products?.length || 0} products`);
    
    // Process products (validate images etc.)
    console.log('[API:products] Processing product data');
    const processedProducts = products?.map(product => {
      // Validate image URL for each product
      if (!product.image || !product.image.startsWith('http')) {
        console.log(`[API:products] Product ID ${product.id} has invalid image URL, using fallback`);
        return {
          ...product,
          image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8'
        };
      }
      return product;
    }) || [];
    
    // Prepare the response
    const response = {
      products: processedProducts,
      pagination: {
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize: pageSize
      }
    };
    
    console.log(`[API:products] Sending response with ${processedProducts.length} products`);
    console.log(`[API:products] Pagination: page ${page}/${Math.ceil((count || 0) / pageSize)}`);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API:products] Error processing request:', error);
    console.error('[API:products] Error details:', error.message);
    if (error.stack) {
      console.error('[API:products] Stack trace:', error.stack);
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
