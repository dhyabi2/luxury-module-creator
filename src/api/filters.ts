
// Edge API for filters data
// Now uses Supabase database instead of in-memory data

import { filtersDb } from '../lib/db';

// Edge function handler
export default async (req: Request) => {
  console.log('Filters API request received:', req.url);
  
  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || '';
    
    // Query the database
    const responseData = await filtersDb.getAll(category);
    
    console.log('Returning filters data');
    
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
    // Log the error but don't handle it - let it throw itself
    console.error('Error in filters API:', error);
    throw error;
  }
};
