
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
    .single();
  
  if (error) {
    console.error('Error fetching navigation data:', error);
    throw error;
  }
  
  console.log('Returning navigation data');
  
  return new Response(
    JSON.stringify(data.data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
