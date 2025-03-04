
// Edge API for navigation data
// Now uses Supabase database instead of in-memory data

import { navigationDb } from '../lib/db';

// Edge function handler
export default async (req: Request) => {
  console.log('Navigation API request received:', req.url);
  
  try {
    // Query the database
    const result = await navigationDb.getAll();
    
    console.log('Returning navigation data');
    
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
    console.error('Error in navigation API:', error);
    throw error;
  }
};
