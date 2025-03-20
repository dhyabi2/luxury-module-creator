
// Edge API for products data
// Now uses Supabase database instead of in-memory data
import { productsDb } from '../lib/db';

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
  
  // Query the database - let errors propagate naturally
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
  
  // Return the response
  return new Response(
    JSON.stringify(result),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
