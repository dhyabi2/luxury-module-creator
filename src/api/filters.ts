
// Edge API for filters data
// Now uses Supabase database instead of in-memory data

import { filtersDb } from '../lib/db';

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
    // Query the database
    const responseData = await filtersDb.getAll(category);
    
    console.log('[API:filters] Filters data retrieved successfully');
    console.log('[API:filters] Response data summary:', {
      categories: responseData.categories?.length || 0,
      brands: responseData.brands?.length || 0,
      bands: responseData.bands?.length || 0,
      caseColors: responseData.caseColors?.length || 0,
      colors: responseData.colors?.length || 0,
      priceRange: responseData.priceRange ? `${responseData.priceRange.min}-${responseData.priceRange.max}` : 'not available',
      caseSizeRange: responseData.caseSizeRange ? `${responseData.caseSizeRange.min}-${responseData.caseSizeRange.max}` : 'not available'
    });
    
    // Return the response
    return new Response(
      JSON.stringify(responseData),
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
