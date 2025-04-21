
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { applyAllFilters } from './filters/index.ts';
import { applySorting, applyPagination } from './pagination.ts';
import { handleQueryError, handleSimplifiedQuery } from './error-handler.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range, cache-control',
};

export const handleProductsRequest = async (req: Request) => {
  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    
    console.log('[API:products] Request parameters:', params);
    
    // Create Supabase client with completely unrestricted access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract pagination parameters
    const page = parseInt(params.page || '1');
    const pageSize = parseInt(params.pageSize || '8');
    
    // Start building the query
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    try {
      // Apply filters
      query = applyAllFilters(query, params);
      
      // Execute count query first
      const { count, error: countError } = await query;
      
      if (countError) throw countError;
      
      // Apply sorting and pagination
      query = applySorting(query, params.sortBy || 'featured');
      query = applyPagination(query, page, pageSize);
      
      // Execute the data query
      const { data: products, error } = await query;
      
      if (error) throw error;
      
      const response = {
        products: products || [],
        pagination: {
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page,
          pageSize: pageSize
        }
      };
      
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (queryError) {
      console.error('[API:products] Initial query failed, attempting simplified query');
      
      // Try simplified query for problematic cases
      try {
        const { products, count } = await handleSimplifiedQuery(supabase, params, page, pageSize);
        
        const response = {
          products: products || [],
          pagination: {
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
            currentPage: page,
            pageSize: pageSize
          }
        };
        
        return new Response(
          JSON.stringify(response),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      } catch (fallbackError) {
        return handleQueryError(fallbackError, 'Simplified query');
      }
    }
  } catch (error) {
    return handleQueryError(error, 'Request handling');
  }
};
