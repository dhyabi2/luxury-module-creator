
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Configure CORS headers to allow all origins
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Default gender options that will always be included
const DEFAULT_GENDERS = [
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'unisex', name: 'Unisex' }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:filters] Handling CORS preflight request with completely unrestricted access');
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Parse URL and query parameters
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || '';
  
  console.log('[API:filters] Request received from:', req.headers.get('origin') || 'unknown origin');
  console.log('[API:filters] Request method:', req.method);
  console.log('[API:filters] Request parameters:', {
    category: category || 'not set'
  });
  
  try {
    // First, fetch existing brands directly from the products table for accuracy
    console.log('[API:filters] Querying products table for actual brands');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('brand, price')
      .order('brand');
    
    if (productsError) {
      console.error('[API:filters] Error fetching product brands:', productsError);
      throw new Error(`Error fetching product brands: ${productsError.message}`);
    }
    
    // Extract unique brands from products
    const uniqueBrands = new Map();
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = 0;
    
    productsData.forEach(product => {
      // Process brand information
      const brandId = product.brand.toLowerCase().replace(/\s+/g, '-');
      if (!uniqueBrands.has(brandId)) {
        uniqueBrands.set(brandId, { 
          id: brandId, 
          name: product.brand,
          count: 1 
        });
      } else {
        uniqueBrands.get(brandId).count++;
      }
      
      // Track min and max prices
      if (product.price < minPrice) {
        minPrice = product.price;
      }
      if (product.price > maxPrice) {
        maxPrice = product.price;
      }
    });
    
    // Convert map to array and sort by name
    const actualBrands = Array.from(uniqueBrands.values())
      .sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`[API:filters] Found ${actualBrands.length} unique brands in products table`);
    console.log(`[API:filters] Price range from products: ${minPrice} - ${maxPrice}`);
      
    // Now fetch the rest of the filters data
    console.log('[API:filters] Querying database for filters data');
    const { data, error } = await supabase
      .from('filters')
      .select('data')
      .eq('id', 1)
      .maybeSingle();
    
    if (error) {
      console.error('[API:filters] Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      console.error('[API:filters] No filter data found');
      throw new Error('No filter data found');
    }
    
    console.log('[API:filters] Filters data retrieved successfully');
    console.log('[API:filters] Response structure:', Object.keys(data.data));
    
    // Create a copy of the data to modify
    const responseData = { ...data.data };
    
    // Replace the brands with actual brands from products table
    responseData.brands = actualBrands;
    
    // Update price range with actual min and max prices from the products
    responseData.priceRange = {
      min: Math.floor(minPrice),  // Round down to nearest integer
      max: Math.ceil(maxPrice),   // Round up to nearest integer
      unit: responseData.priceRange?.unit || 'OMR'  // Keep the existing unit or use default
    };
    
    // Filter category-specific brands if available
    if (responseData.categoryBrands) {
      // Create empty category-specific mapping
      const categoryBrands = {};
      
      // Update category brands based on actual products
      if (category) {
        const categories = category.split(',').map(c => c.trim().toLowerCase());
        
        for (const categoryId of categories) {
          if (categoryId === 'all') continue;
          
          console.log(`[API:filters] Filtering brands for category: ${categoryId}`);
          
          // Query products for this specific category to get actual brands
          const { data: categoryProducts, error: categoryError } = await supabase
            .from('products')
            .select('brand, price')
            .ilike('category', `%${categoryId}%`);
          
          if (categoryError) {
            console.error(`[API:filters] Error fetching brands for category ${categoryId}:`, categoryError);
            continue;
          }
          
          // Extract unique brands for this category
          const categoryBrandsMap = new Map();
          let categoryMinPrice = Number.MAX_SAFE_INTEGER;
          let categoryMaxPrice = 0;
          
          categoryProducts.forEach(product => {
            // Process brand
            const brandId = product.brand.toLowerCase().replace(/\s+/g, '-');
            if (!categoryBrandsMap.has(brandId)) {
              categoryBrandsMap.set(brandId, { 
                id: brandId, 
                name: product.brand,
                count: 1 
              });
            } else {
              categoryBrandsMap.get(brandId).count++;
            }
            
            // Track price range for this category
            if (product.price < categoryMinPrice) {
              categoryMinPrice = product.price;
            }
            if (product.price > categoryMaxPrice) {
              categoryMaxPrice = product.price;
            }
          });
          
          // Store in categoryBrands
          categoryBrands[categoryId] = Array.from(categoryBrandsMap.values());
          console.log(`[API:filters] Found ${categoryBrands[categoryId].length} brands for category ${categoryId}`);
          
          // Store category-specific price range if we have products
          if (categoryProducts.length > 0) {
            console.log(`[API:filters] Price range for category ${categoryId}: ${categoryMinPrice} - ${categoryMaxPrice}`);
            categoryBrands[`${categoryId}-priceRange`] = {
              min: Math.floor(categoryMinPrice),
              max: Math.ceil(categoryMaxPrice),
              unit: responseData.priceRange?.unit || 'OMR'
            };
          }
        }
      }
      
      // Update the response data with filtered category brands
      responseData.categoryBrands = categoryBrands;
    }
    
    // Always ensure genders key exists with default values
    responseData.genders = DEFAULT_GENDERS;
    
    console.log('[API:filters] Ensuring gender data is available');
    console.log('[API:filters] Final price range:', responseData.priceRange);
    
    // Return the response with proper CORS headers
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('[API:filters] Error processing request:', error);
    
    // Even in error case, try to return min and max prices
    const { data: productsData } = await supabase
      .from('products')
      .select('brand, price');
    
    // Extract unique brands even in error case
    const uniqueBrands = new Map();
    let fallbackMinPrice = 0;
    let fallbackMaxPrice = 1000;
    
    if (productsData) {
      productsData.forEach(product => {
        // Process brand
        const brandId = product.brand.toLowerCase().replace(/\s+/g, '-');
        if (!uniqueBrands.has(brandId)) {
          uniqueBrands.set(brandId, { 
            id: brandId, 
            name: product.brand,
            count: 1 
          });
        } else {
          uniqueBrands.get(brandId).count++;
        }
        
        // Track min and max prices
        if (product.price < fallbackMinPrice || fallbackMinPrice === 0) {
          fallbackMinPrice = product.price;
        }
        if (product.price > fallbackMaxPrice) {
          fallbackMaxPrice = product.price;
        }
      });
    }
    
    const defaultResponse = {
      categories: [],
      brands: Array.from(uniqueBrands.values()),
      bands: [],
      colors: [],
      caseColors: [],
      priceRange: { 
        min: Math.floor(fallbackMinPrice || 0), 
        max: Math.ceil(fallbackMaxPrice || 1000), 
        unit: 'OMR' 
      },
      genders: DEFAULT_GENDERS
    };
    
    return new Response(JSON.stringify(defaultResponse), {
      status: 200, // Return 200 even for errors to prevent client retries
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
