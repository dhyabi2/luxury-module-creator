
// Edge API for navigation data
import { supabase } from '../integrations/supabase/client';

// Edge function handler
export default async function(req: Request) {
  console.log('[API:navigation] Request received:', req.url);
  
  try {
    // Direct Supabase query
    const { data, error } = await supabase
      .from('navigation')
      .select('data')
      .eq('type', 'main')
      .maybeSingle();
    
    // Log the error or success
    if (error) {
      console.error('[API:navigation] Error fetching navigation data:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (!data) {
      console.error('[API:navigation] No navigation data found');
      return new Response(JSON.stringify({ error: 'No navigation data found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    console.log('[API:navigation] Returning navigation data');
    
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
  } catch (error) {
    console.error('[API:navigation] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
