
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
  const params = Object.fromEntries(url.searchParams.entries());
  
  console.log('[API:products] Request parameters:', params);
  
  // Extract pagination and filter parameters
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '8');
  
  try {
    // Start building the query
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (params.brand) {
      const brands = params.brand.split(',');
      query = query.in('brand', brands);
    }
    
    if (params.category) {
      const categories = params.category.split(',');
      query = query.in('category', categories);
    }
    
    if (params.minPrice && params.maxPrice) {
      query = query.gte('price', parseFloat(params.minPrice))
                 .lte('price', parseFloat(params.maxPrice));
    }
    
    // Apply sorting
    const sortBy = params.sortBy || 'featured';
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
    const { count, error: countError } = await query;
    
    if (countError) {
      throw countError;
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    // Execute the data query
    const { data: products, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Prepare the response
    const response = {
      products: products || [],
      pagination: {
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize: pageSize
      }
    };
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
