
// Edge API for products data
// Now uses Supabase database instead of in-memory data
import { productsDb } from '../lib/db';

// Add cache support to reduce duplicate calls
const CACHE_TIME = 60; // 60 seconds

// Edge function handler
export default async (req: Request) => {
  console.log('[API:products] Request received:', req.url);
  
  // Parse URL and query parameters
  const url = new URL(req.url);
  const brand = url.searchParams.get('brand') || '';
  const category = url.searchParams.get('category') || '';
  const gender = url.searchParams.get('gender') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '8');
  const sortBy = url.searchParams.get('sortBy') || 'featured';
  
  // Additional filter parameters
  const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice') || '0') : undefined;
  const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice') || '1000') : undefined;
  const minCaseSize = url.searchParams.get('minCaseSize') ? parseFloat(url.searchParams.get('minCaseSize') || '0') : undefined;
  const maxCaseSize = url.searchParams.get('maxCaseSize') ? parseFloat(url.searchParams.get('maxCaseSize') || '50') : undefined;
  const band = url.searchParams.get('band') || '';
  const caseColor = url.searchParams.get('caseColor') || '';
  const color = url.searchParams.get('color') || '';
  
  console.log('[API:products] Request parameters:', {
    brand,
    category,
    gender,
    page,
    pageSize,
    sortBy,
    priceRange: minPrice !== undefined && maxPrice !== undefined ? `${minPrice}-${maxPrice}` : 'not set',
    caseSizeRange: minCaseSize !== undefined && maxCaseSize !== undefined ? `${minCaseSize}-${maxCaseSize}` : 'not set',
    band: band || 'not set',
    caseColor: caseColor || 'not set',
    color: color || 'not set'
  });
  
  try {
    console.log('[API:products] Calling productsDb.getAll');
    // Query the database
    const result = await productsDb.getAll(
      { 
        brand, 
        category,
        gender,
        minPrice,
        maxPrice,
        minCaseSize,
        maxCaseSize,
        band,
        caseColor,
        color
      },
      { page, pageSize },
      { sortBy }
    );
    
    console.log(`[API:products] Database returned ${result.products.length} products (page ${result.pagination.currentPage}/${result.pagination.totalPages})`);
    
    // Return the response with caching headers
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_TIME}`,
          'ETag': generateETag(result)
        }
      }
    );
  } catch (error) {
    console.error('[API:products] Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch products',
        products: [],
        pagination: {
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: pageSize
        } 
      }),
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

// Helper to generate a simple ETag for caching
function generateETag(data: any): string {
  // Simple hash function for objects
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `"${hash.toString(16)}"`;
}
