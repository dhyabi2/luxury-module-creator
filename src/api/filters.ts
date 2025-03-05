
// Edge API for filters data
// Now uses Supabase database instead of in-memory data

import { filtersDb } from '../lib/db';
import { FiltersResponse } from '../types/api';

// Edge function handler
export default async (req: Request) => {
  console.log('[API:filters] Request received:', req.url);
  
  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    
    console.log('[API:filters] Request parameters:', {
      category: category || 'not set'
    });
    
    console.log('[API:filters] Calling filtersDb.getAll');
    // Query the database - don't pass category as getAll doesn't accept parameters
    const responseData = await filtersDb.getAll();
    
    console.log('[API:filters] Filters data retrieved successfully');
    
    // Make sure we're dealing with the right type of data
    const filtersData = typeof responseData === 'string' 
      ? JSON.parse(responseData) as FiltersResponse
      : responseData as FiltersResponse;
      
    console.log('[API:filters] Response data summary:', {
      categories: filtersData.categories?.length || 0,
      brands: filtersData.brands?.length || 0,
      bands: filtersData.bands?.length || 0,
      caseColors: filtersData.caseColors?.length || 0,
      colors: filtersData.colors?.length || 0,
      priceRange: filtersData.priceRange ? `${filtersData.priceRange.min}-${filtersData.priceRange.max}` : 'not available',
      caseSizeRange: filtersData.caseSizeRange ? `${filtersData.caseSizeRange.min}-${filtersData.caseSizeRange.max}` : 'not available'
    });
    
    // Return the response
    return new Response(
      JSON.stringify(filtersData),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('[API:filters] Error in filters API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch filters data' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};
