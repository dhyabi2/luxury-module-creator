
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Configure CORS headers to allow all origins
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range, cache-control',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:filter-products] Handling CORS preflight request');
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Extract request data
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    
    // We will not use any request body payload as requested
    console.log('[API:filter-products] Request method:', req.method);
    console.log('[API:filter-products] Applying filters from URL params:', params);
    
    // Create Supabase client with open access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract pagination parameters
    const page = parseInt(params.page as string || '1');
    const pageSize = parseInt(params.pageSize as string || '8');
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building the query
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply brand filter
    if (params.brand) {
      const brands = (params.brand as string).split(',').map(b => b.trim());
      
      if (!brands.includes('all') && brands.length > 0) {
        if (brands.length === 1) {
          query = query.ilike('brand', `%${brands[0]}%`);
          console.log(`[API:filter-products] Filtering by single brand: ${brands[0]}`);
        } else {
          console.log(`[API:filter-products] Filtering by multiple brands: ${brands.join(', ')}`);
          // For multiple brands, create OR conditions with ilike for each brand
          const orConditions = brands.map(brand => `brand.ilike.%${brand}%`).join(',');
          query = query.or(orConditions);
        }
      }
    }
    
    // Apply category filter using ilike for case-insensitive matching
    const categoryParam = params.category || params.categories;
    if (categoryParam) {
      const categories = (categoryParam as string).split(',').map(c => c.trim().toLowerCase());
      console.log(`[API:filter-products] Filtering by categories: ${categories.join(', ')}`);
      
      if (!categories.includes('all') && categories.length > 0) {
        if (categories.length === 1) {
          console.log(`[API:filter-products] Exact match for category: ${categories[0]}`);
          query = query.ilike('category', categories[0]);
        } else {
          console.log(`[API:filter-products] Multiple categories with ILIKE operator: ${categories}`);
          // For multiple categories, create OR conditions with ilike
          const orConditions = categories.map(cat => `category.ilike.${cat}`).join(',');
          query = query.or(orConditions);
        }
      }
    }
    
    // Apply gender filter
    if (params.gender) {
      const genders = (params.gender as string).split(',').map(g => g.trim());
      
      if (!genders.includes('all') && genders.length > 0) {
        const textConditions = [];
        for (const gender of genders) {
          textConditions.push(`specifications::text ilike '%"gender":"${gender}"%'`);
          textConditions.push(`specifications::text ilike '%"gender": "${gender}"%'`);
        }
        query = query.or(textConditions.join(','));
      }
    }
    
    // Apply price range filter
    if (params.minPrice && params.maxPrice) {
      const minPrice = parseFloat(params.minPrice as string);
      const maxPrice = parseFloat(params.maxPrice as string);
      console.log(`[API:filter-products] Filtering by price range: ${minPrice} - ${maxPrice}`);
      query = query.gte('price', minPrice).lte('price', maxPrice);
    }
    
    // Apply band material filter
    if (params.band) {
      const bands = (params.band as string).split(',').map(b => b.trim());
      
      if (!bands.includes('all') && bands.length > 0) {
        const orConditions = bands.map(band => `specifications->strapMaterial.ilike.%${band}%`).join(',');
        query = query.or(orConditions);
      }
    }
    
    // Apply case color filter
    if (params.caseColor) {
      const caseColors = (params.caseColor as string).split(',').map(c => c.trim());
      
      if (!caseColors.includes('all') && caseColors.length > 0) {
        const orConditions = caseColors.map(color => `specifications->caseMaterial.ilike.%${color}%`).join(',');
        query = query.or(orConditions);
      }
    }
    
    // Apply dial/strap color filter
    if (params.color) {
      const colors = (params.color as string).split(',').map(c => c.trim());
      
      if (!colors.includes('all') && colors.length > 0) {
        const orConditions = colors.map(color => 
          `specifications->dialColor.ilike.%${color}%,specifications->strapColor.ilike.%${color}%`
        ).join(',');
        query = query.or(orConditions);
      }
    }
    
    // Apply stock filter - items in stock
    if (params.instock === 'true') {
      query = query.gt('stock', 0);
    }
    
    // Apply clearance filter - items with discount
    if (params.clearance === 'true') {
      query = query.gt('discount', 0);
    }
    
    // Apply sorting
    const sortBy = params.sortBy as string || 'featured';
    switch (sortBy) {
      case 'price-low-high':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high-low':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      default: // 'featured'
        query = query.order('id', { ascending: true });
    }
    
    // Execute count query
    console.log('[API:filter-products] Executing count query');
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error('[API:filter-products] Error getting product count:', countError);
      throw countError;
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute data query
    console.log('[API:filter-products] Executing data query with pagination');
    const { data: products, error } = await query;
    
    if (error) {
      console.error('[API:filter-products] Error fetching products:', error);
      throw error;
    }
    
    const response = {
      products: products || [],
      pagination: {
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize: pageSize
      },
      appliedFilters: params
    };
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('[API:filter-products] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
