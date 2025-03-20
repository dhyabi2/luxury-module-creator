
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
    
    // Brand filter
    if (params.brand) {
      const brands = params.brand.split(',').map((b) => b.trim());
      console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
      query = query.in('brand', brands);
    }
    
    // Category filter
    if (params.category) {
      const categories = params.category.split(',').map((c) => c.trim());
      console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
      query = query.in('category', categories);
    }
    
    // Gender filter
    if (params.gender) {
      const genders = params.gender.split(',').map((g) => g.trim());
      console.log(`[API:products] Filtering by genders: ${genders.join(', ')}`);
      
      // FIX: Using contains for JSON data instead of eq
      if (genders.length > 0) {
        // Use contains which is safer for JSON fields
        query = query.contains('specifications', { gender: genders[0] });
        
        // For multiple genders, use OR conditions
        if (genders.length > 1) {
          for (let i = 1; i < genders.length; i++) {
            query = query.or(`specifications->gender.eq.${genders[i]}`);
          }
        }
      }
    }
    
    // Price range filter
    if (params.minPrice && params.maxPrice) {
      console.log(`[API:products] Filtering by price range: $${params.minPrice} - $${params.maxPrice}`);
      query = query.gte('price', parseFloat(params.minPrice))
               .lte('price', parseFloat(params.maxPrice));
    }
    
    // Case size filter
    if (params.minCaseSize && params.maxCaseSize) {
      console.log(`[API:products] Filtering by case size: ${params.minCaseSize}mm - ${params.maxCaseSize}mm`);
      
      // FIX: Use more lenient filtering for case size - just check if it contains the mm values
      const minSize = parseInt(params.minCaseSize);
      const maxSize = parseInt(params.maxCaseSize);
      
      // Use a range-based approach rather than exact matching
      for (let size = minSize; size <= maxSize; size++) {
        query = query.or(`specifications->caseSize.like.%${size}mm%`);
      }
    }
    
    // Band material filter
    if (params.band) {
      const bands = params.band.split(',').map((b) => b.trim());
      console.log(`[API:products] Filtering by band materials: ${bands.join(', ')}`);
      
      // FIX: Use contains operator for JSON fields
      if (bands.length > 0) {
        // Use contains which is safer for JSON fields
        query = query.contains('specifications', { strapMaterial: bands[0] });
        
        // For additional bands, use OR conditions with contains
        if (bands.length > 1) {
          for (let i = 1; i < bands.length; i++) {
            query = query.or(`specifications->strapMaterial.eq.${bands[i]}`);
          }
        }
      }
    }
    
    // Case color filter
    if (params.caseColor) {
      const caseColors = params.caseColor.split(',').map((c) => c.trim());
      console.log(`[API:products] Filtering by case colors: ${caseColors.join(', ')}`);
      
      // FIX: Use contains operator for JSON fields
      if (caseColors.length > 0) {
        // Use contains which is safer for JSON fields
        query = query.contains('specifications', { caseMaterial: caseColors[0] });
        
        // For additional case colors, use OR conditions with contains
        if (caseColors.length > 1) {
          for (let i = 1; i < caseColors.length; i++) {
            query = query.or(`specifications->caseMaterial.eq.${caseColors[i]}`);
          }
        }
      }
    }
    
    // Dial/strap color filter
    if (params.color) {
      const colors = params.color.split(',').map((c) => c.trim());
      console.log(`[API:products] Filtering by colors: ${colors.join(', ')}`);
      
      // FIX: Use more reliable OR conditions for JSON fields
      if (colors.length > 0) {
        // Start with first color
        query = query.or(`specifications->dialColor.eq.${colors[0]},specifications->strapColor.eq.${colors[0]}`);
        
        // Add OR conditions for additional colors
        for (let i = 1; i < colors.length; i++) {
          query = query.or(`specifications->dialColor.eq.${colors[i]},specifications->strapColor.eq.${colors[i]}`);
        }
      }
    }
    
    // New arrivals filter
    if (params.isNewIn === 'true') {
      console.log('[API:products] Filtering by new arrivals');
      // Simulate new items by getting latest IDs
      query = query.order('id', { ascending: false }).limit(50);
    }
    
    // Sale items filter
    if (params.isOnSale === 'true') {
      console.log('[API:products] Filtering by sale items');
      query = query.gt('discount', 0);
    }
    
    // Execute count query first
    console.log('[API:products] Executing count query');
    const { count, error: countError } = await query;
    
    if (countError) {
      console.error('[API:products] Count query error:', countError);
      throw countError;
    }
    
    console.log(`[API:products] Total products found: ${count}`);
    
    // Apply sorting
    const sortBy = params.sortBy || 'featured';
    console.log(`[API:products] Sorting by: ${sortBy}`);
    
    if (sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('id', { ascending: false });
    } else {
      // Default sorting (featured)
      query = query.order('id', { ascending: true });
    }
    
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
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
