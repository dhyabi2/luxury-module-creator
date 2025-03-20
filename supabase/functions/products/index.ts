
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
      
      // FIXED: Build a properly formatted filter for gender in JSONB
      if (genders.length > 0) {
        const genderFilter = {};
        genderFilter['gender'] = genders[0];
        
        // Use containedBy for JSONB which is more reliable
        query = query.containedBy('specifications', genderFilter);
        
        // For multiple genders, add OR conditions
        if (genders.length > 1) {
          let orConditions = [];
          for (let i = 1; i < genders.length; i++) {
            const additionalFilter = {};
            additionalFilter['gender'] = genders[i];
            orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
          }
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','));
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
      
      // FIXED: Use text match for case size instead of JSON matching
      // This approach uses ilike to look for case size values in the text representation
      const minSize = parseInt(params.minCaseSize);
      const maxSize = parseInt(params.maxCaseSize);
      
      let sizeConditions = [];
      for (let size = minSize; size <= maxSize; size++) {
        sizeConditions.push(`specifications::text ilike '%"caseSize":"${size}mm"%'`);
        sizeConditions.push(`specifications::text ilike '%"caseSize": "${size}mm"%'`);
      }
      
      if (sizeConditions.length > 0) {
        query = query.or(sizeConditions.join(','));
      }
    }
    
    // Band material filter
    if (params.band) {
      const bands = params.band.split(',').map((b) => b.trim());
      console.log(`[API:products] Filtering by band materials: ${bands.join(', ')}`);
      
      // FIXED: Build a properly formatted filter for strapMaterial in JSONB
      if (bands.length > 0) {
        const bandFilter = {};
        bandFilter['strapMaterial'] = bands[0];
        
        // Use containedBy for JSONB
        query = query.containedBy('specifications', bandFilter);
        
        // For multiple bands, add OR conditions
        if (bands.length > 1) {
          let orConditions = [];
          for (let i = 1; i < bands.length; i++) {
            const additionalFilter = {};
            additionalFilter['strapMaterial'] = bands[i];
            orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
          }
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','));
          }
        }
      }
    }
    
    // Case color filter
    if (params.caseColor) {
      const caseColors = params.caseColor.split(',').map((c) => c.trim());
      console.log(`[API:products] Filtering by case colors: ${caseColors.join(', ')}`);
      
      // FIXED: Build a properly formatted filter for caseMaterial in JSONB
      if (caseColors.length > 0) {
        const caseColorFilter = {};
        caseColorFilter['caseMaterial'] = caseColors[0];
        
        // Use containedBy for JSONB
        query = query.containedBy('specifications', caseColorFilter);
        
        // For multiple case colors, add OR conditions
        if (caseColors.length > 1) {
          let orConditions = [];
          for (let i = 1; i < caseColors.length; i++) {
            const additionalFilter = {};
            additionalFilter['caseMaterial'] = caseColors[i];
            orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
          }
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','));
          }
        }
      }
    }
    
    // Dial/strap color filter
    if (params.color) {
      const colors = params.color.split(',').map((c) => c.trim());
      console.log(`[API:products] Filtering by colors: ${colors.join(', ')}`);
      
      // FIXED: Use more reliable text search for colors
      if (colors.length > 0) {
        let colorConditions = [];
        
        for (let i = 0; i < colors.length; i++) {
          colorConditions.push(`specifications::text ilike '%"dialColor":"${colors[i]}"%'`);
          colorConditions.push(`specifications::text ilike '%"strapColor":"${colors[i]}"%'`);
          colorConditions.push(`specifications::text ilike '%"dialColor": "${colors[i]}"%'`);
          colorConditions.push(`specifications::text ilike '%"strapColor": "${colors[i]}"%'`);
        }
        
        if (colorConditions.length > 0) {
          query = query.or(colorConditions.join(','));
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
