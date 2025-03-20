
// Edge API for navigation data
import { navigationDb } from '../lib/db';

// Edge function handler
export default async (req: Request) => {
  console.log('Navigation API request received:', req.url);
  
  // Query the database - let errors propagate naturally
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
};
