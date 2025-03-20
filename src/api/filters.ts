
// Edge API for filters data
import { supabase } from '../integrations/supabase/client';
import { FiltersResponse } from '../types/api';

// Edge function handler
export default async function(req: Request) {
  console.log('[API:filters] Request received:', req.url);
  
  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    
    console.log('[API:filters] Request parameters:', {
      category: category || 'not set'
    });
    
    // Fetch filters directly from Supabase
    console.log('[API:filters] Fetching filters from Supabase');
    const { data, error } = await supabase.from('filters').select('data').eq('id', 1).maybeSingle();
    
    if (error) {
      console.error('[API:filters] Error fetching filters:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (!data) {
      console.error('[API:filters] No filters data found');
      return new Response(JSON.stringify({ error: 'No filters data found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
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
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('[API:filters] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
