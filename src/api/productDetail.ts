
// Edge API for product detail
import { supabase } from '../integrations/supabase/client';

export default async function productDetailHandler(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];

    console.log(`API: Fetching product detail for ID: ${productId}`);

    // Direct Supabase query without auth checks
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    if (!data) {
      console.error(`Product with ID ${productId} not found`);
      return new Response(
        JSON.stringify({ error: `Product with ID ${productId} not found` }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Validate image URL for single product
    if (!data.image || !data.image.startsWith('http')) {
      data.image = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8';
    }

    return new Response(
      JSON.stringify({
        product: data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Error in product detail handler:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
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
