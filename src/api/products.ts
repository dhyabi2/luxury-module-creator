
// Edge API for products data
// Now uses Supabase database instead of in-memory data

import { productsDb } from '../lib/db';

// Edge function handler
export default async (req: Request) => {
  console.log('Products API request received:', req.url);
  
  // Parse URL and query parameters
  const url = new URL(req.url);
  const brand = url.searchParams.get('brand') || '';
  const category = url.searchParams.get('category') || '';
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
  
  console.log(`Processing request with filters: brand=${brand}, category=${category}, price=${minPrice}-${maxPrice}, caseSize=${minCaseSize}-${maxCaseSize}`);
  
  try {
    // Query the database
    const result = await productsDb.getAll(
      { 
        brand, 
        category,
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
    
    console.log(`Returning ${result.products.length} products (page ${result.pagination.currentPage}/${result.pagination.totalPages})`);
    
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
  } catch (error) {
    console.error('Error in products API:', error);
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
