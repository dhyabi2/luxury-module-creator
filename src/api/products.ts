
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
  
  console.log(`Processing request: brand=${brand}, category=${category}, page=${page}, pageSize=${pageSize}, sortBy=${sortBy}`);
  
  try {
    // Query the database
    const result = await productsDb.getAll(
      { brand, category },
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
    // Log the error but don't handle it - let it throw itself
    console.error('Error in products API:', error);
    throw error;
  }
};
