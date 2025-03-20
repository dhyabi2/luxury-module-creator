
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders, createResponse, processProducts } from './utils.ts';
import { applyAllFilters } from './filters.ts';
import { applySorting, applyPagination } from './pagination.ts';

serve(async (req) => {
  // Handle CORS preflight requests with completely unrestricted access
  if (req.method === 'OPTIONS') {
    console.log('[API:products] Handling CORS preflight request with completely unrestricted access');
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    
    // Check if requesting accessories category to skip problematic filters
    const isAccessoryCategory = params.category && 
      (typeof params.category === 'string' && 
        (params.category.toLowerCase().includes('accessories') || 
         params.category.toLowerCase().includes('bags') || 
         params.category.toLowerCase().includes('perfumes')));
    
    if (isAccessoryCategory) {
      console.log('[API:products] Non-watch category detected, will skip watch-specific filters');
      // Remove case size parameters to avoid filter errors
      delete params.minCaseSize;
      delete params.maxCaseSize;
    }
    
    // Extract pagination and sort parameters
    const page = parseInt(params.page || '1');
    const pageSize = parseInt(params.pageSize || '8');
    const sortBy = params.sortBy || 'featured';
    
    // Start building the query - completely unrestricted, public access
    console.log('[API:products] Building query with completely unrestricted public access');
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply filters
    query = applyAllFilters(query, params);
    
    // Execute count query first
    console.log('[API:products] Executing count query with completely public access');
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error('[API:products] Count query error:', countError);
      throw countError;
    }
    
    console.log(`[API:products] Total products found: ${count}`);
    
    // Apply sorting
    query = applySorting(query, sortBy);
    
    // Apply pagination
    query = applyPagination(query, page, pageSize);
    
    // Execute the data query
    console.log('[API:products] Executing data query with completely unrestricted public access');
    const { data: products, error } = await query;
    
    if (error) {
      console.error('[API:products] Data query error:', error);
      throw error;
    }
    
    console.log(`[API:products] Retrieved ${products?.length || 0} products`);
    
    // Process products
    const processedProducts = processProducts(products);
    
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
    
    return createResponse(response);
  } catch (error) {
    console.error('[API:products] Error processing request:', error);
    
    return createResponse({ error: error.message }, 500);
  }
});
