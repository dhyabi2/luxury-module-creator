
// Edge API for navigation data
import { supabase } from '../integrations/supabase/client';

// Edge function handler
export default async (req: Request) => {
  console.log('Navigation API request received:', req.url);
  
  // Direct Supabase query
  const { data, error } = await supabase
    .from('navigation')
    .select('data')
    .eq('type', 'main')
    .maybeSingle();
  
  // Log the error or success
  if (error) {
    console.error('Error fetching navigation data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  if (!data) {
    console.error('No navigation data found');
    return new Response(JSON.stringify({ error: 'No navigation data found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  console.log('Returning navigation data');
  
  return new Response(
    JSON.stringify(data.data),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
