
// Edge API for products data
import { supabase } from '../integrations/supabase/client';

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
  
  // Build the query
  let query = supabase.from('products').select('*', { count: 'exact' });
  
  // Apply filters
  if (brand) {
    query = query.eq('brand', brand);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (gender && gender !== 'all') {
    query = query.eq('gender', gender);
  }
  
  if (minPrice !== undefined && maxPrice !== undefined) {
    query = query.gte('price', minPrice).lte('price', maxPrice);
  }
  
  // Apply watch-specific filters if available
  if (band) {
    query = query.eq('band', band);
  }
  
  if (caseColor) {
    query = query.eq('case_color', caseColor);
  }
  
  if (color) {
    query = query.eq('color', color);
  }
  
  if (minCaseSize !== undefined && maxCaseSize !== undefined) {
    query = query.gte('case_size', minCaseSize).lte('case_size', maxCaseSize);
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default: // 'featured'
      query = query.order('rating', { ascending: false });
      break;
  }
  
  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);
  
  // Execute the query
  const { data: products, count, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  const totalPages = count ? Math.ceil(count / pageSize) : 0;
  
  console.log(`[API:products] Database returned ${products?.length || 0} products (page ${page}/${totalPages})`);
  
  // Return the response
  return new Response(
    JSON.stringify({
      products: products || [],
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount: count || 0
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
