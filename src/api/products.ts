
// Edge API for products
import { supabase } from '../integrations/supabase/client';
import { getAll } from '../lib/db/products';

export default async function productsHandler(req: Request) {
  console.log('[API:products] Request received:', req.url);
  
  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    
    console.log('[API:products] Request parameters:', {
      brand: params.brand || '',
      category: params.category || '',
      gender: params.gender || '',
      page: parseInt(params.page || '1'),
      pageSize: parseInt(params.pageSize || '8'),
      sortBy: params.sortBy || 'featured',
      priceRange: params.minPrice && params.maxPrice ? `${params.minPrice}-${params.maxPrice}` : 'not set',
      caseSizeRange: params.minCaseSize && params.maxCaseSize ? `${params.minCaseSize}-${params.maxCaseSize}` : 'not set',
      band: params.band || 'not set',
      caseColor: params.caseColor || 'not set',
      color: params.color || 'not set'
    });
    
    // Prepare filters, pagination, and sorting
    const filters = {
      brand: params.brand,
      category: params.category,
      gender: params.gender,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minCaseSize: params.minCaseSize,
      maxCaseSize: params.maxCaseSize,
      band: params.band,
      caseColor: params.caseColor,
      color: params.color
    };
    
    const pagination = {
      page: parseInt(params.page || '1'),
      pageSize: parseInt(params.pageSize || '8')
    };
    
    const sorting = {
      sortBy: params.sortBy || 'featured'
    };
    
    // Direct database query using the products module
    const result = await getAll(filters, pagination, sorting);
    
    console.log(`[API:products] Database returned ${result.products.length} products (page ${pagination.page}/${result.pagination.totalPages})`);
    
    // Return the response with proper headers
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('[API:products] Error:', error);
    
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
