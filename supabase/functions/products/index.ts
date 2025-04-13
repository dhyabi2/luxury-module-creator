
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders, createResponse, processProducts } from './utils.ts';
import { applyAllFilters } from './filters/index.ts';
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
    
    // Check for watch category and gender search (special handling)
    const isWatchCategory = params.category && params.category.includes('watches');
    const hasGenderSearch = params.genderSearch !== undefined;
    
    if (isWatchCategory && hasGenderSearch) {
      console.log('[API:products] Watch + gender search detected - using optimized query');
    }
    
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
      
      // For accessories, simplify gender filter to avoid JSONB errors
      if (params.gender && params.gender.includes(',')) {
        console.log('[API:products] Simplifying gender filter for non-watch category');
        // Just use a basic query without the gender filter to avoid errors
        delete params.gender;
      }
    }
    
    // Extract pagination and sort parameters
    const page = parseInt(params.page || '1');
    const pageSize = parseInt(params.pageSize || '8');
    const sortBy = params.sortBy || 'featured';
    
    // Start building the query - completely unrestricted, public access
    console.log('[API:products] Building query with completely unrestricted public access');
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    try {
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
    } catch (queryError) {
      console.error('[API:products] Query error:', queryError);
      
      // Special handling for watch + gender combination
      if (isWatchCategory && (params.gender || params.genderSearch)) {
        console.log('[API:products] Trying simplified query for watches + gender');
        
        // Create a simplified query using text search for gender
        let simpleQuery = supabase.from('products')
          .select('*', { count: 'exact' })
          .ilike('category', '%watches%');
          
        // Add gender text search if present
        const genders = params.gender ? 
          params.gender.split(',').map((g: string) => g.trim()) : 
          params.genderSearch ? 
            params.genderSearch.split(',').map((g: string) => g.trim()) : 
            [];
            
        if (genders.length > 0) {
          const firstGender = genders[0];
          simpleQuery = simpleQuery.filter('specifications::text', 'ilike', `%"gender":"${firstGender}"%`);
          
          if (genders.length > 1) {
            console.log('[API:products] Using only first gender for compatibility');
          }
        }
        
        // Execute simplified count query
        const { count: simpleCount } = await simpleQuery;
        
        // Apply pagination
        const simplePaginatedQuery = simpleQuery
          .order('id', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
        
        // Execute simplified data query
        const { data: simpleProducts } = await simplePaginatedQuery;
        
        if (simpleProducts) {
          console.log(`[API:products] Retrieved ${simpleProducts.length} products with simplified query for watches + gender`);
          
          const processedProducts = processProducts(simpleProducts);
          
          // Prepare the response
          const response = {
            products: processedProducts,
            pagination: {
              totalCount: simpleCount || 0,
              totalPages: Math.ceil((simpleCount || 0) / pageSize),
              currentPage: page,
              pageSize: pageSize
            }
          };
          
          return createResponse(response);
        }
      }
      
      // Special handling for non-watch categories with problematic filters
      if (isAccessoryCategory) {
        console.log('[API:products] Trying simplified query for non-watch category');
        
        // Create a very simple query without problematic filters
        const simpleQuery = supabase.from('products')
          .select('*', { count: 'exact' })
          .ilike('category', `%${params.category}%`);
        
        // Execute simplified count query
        const { count: simpleCount } = await simpleQuery;
        
        // Apply pagination
        const simplePaginatedQuery = simpleQuery
          .order('id', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
        
        // Execute simplified data query
        const { data: simpleProducts } = await simplePaginatedQuery;
        
        if (simpleProducts) {
          console.log(`[API:products] Retrieved ${simpleProducts.length} products with simplified query`);
          
          const processedProducts = processProducts(simpleProducts);
          
          // Prepare the response
          const response = {
            products: processedProducts,
            pagination: {
              totalCount: simpleCount || 0,
              totalPages: Math.ceil((simpleCount || 0) / pageSize),
              currentPage: page,
              pageSize: pageSize
            }
          };
          
          return createResponse(response);
        }
      }
      
      // If all else fails, throw the original error
      throw queryError;
    }
  } catch (error) {
    console.error('[API:products] Error processing request:', error);
    
    return createResponse({ error: error.message }, 500);
  }
});
