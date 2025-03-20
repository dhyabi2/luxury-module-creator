
// Edge API for filters data
import { supabase } from '../integrations/supabase/client';
import { FiltersResponse } from '../types/api';

// Edge function handler
export default async (req: Request) => {
  console.log('[API:filters] Request received:', req.url);
  
  // Parse URL and query parameters
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || '';
  
  console.log('[API:filters] Request parameters:', {
    category: category || 'not set'
  });
  
  // Fetch filters directly from Supabase
  console.log('[API:filters] Fetching filters from Supabase');
  const { data, error } = await supabase.from('filters').select('data').eq('id', 1).single();
  
  if (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
  
  console.log('[API:filters] Filters data retrieved successfully');
  
  // Make sure we're dealing with the right type of data
  const filtersData: FiltersResponse = data.data as unknown as FiltersResponse;
    
  // Log response data details for debugging
  console.log('[API:filters] Response data summary:', {
    categories: Array.isArray(filtersData.categories) ? filtersData.categories.length : 0,
    brands: Array.isArray(filtersData.brands) ? filtersData.brands.length : 0,
    bands: Array.isArray(filtersData.bands) ? filtersData.bands.length : 0,
    caseColors: Array.isArray(filtersData.caseColors) ? filtersData.caseColors.length : 0,
    colors: Array.isArray(filtersData.colors) ? filtersData.colors.length : 0,
    priceRange: filtersData.priceRange ? `${filtersData.priceRange.min}-${filtersData.priceRange.max}` : 'not available',
    caseSizeRange: filtersData.caseSizeRange ? `${filtersData.caseSizeRange.min}-${filtersData.caseSizeRange.max}` : 'not available',
    categoryBrands: filtersData.categoryBrands ? Object.keys(filtersData.categoryBrands).length : 0
  });
  
  // Return the response with proper headers
  return new Response(
    JSON.stringify(filtersData),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
