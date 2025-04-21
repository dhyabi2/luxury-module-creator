
import { serve } from 'https://deno.fresh.dev/std@v1/http/server.ts';

const THAWANI_API_BASE_URL = 'https://uatcheckout.thawani.om/api/v1';
const THAWANI_SECRET_KEY = 'rRQ26GcsZzoEhbrP2HZvLYDbn9C9et';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products, success_url, cancel_url, metadata } = await req.json();

    const response = await fetch(`${THAWANI_API_BASE_URL}/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': THAWANI_SECRET_KEY,
      },
      body: JSON.stringify({
        client_reference_id: `order_${Date.now()}`,
        products,
        success_url,
        cancel_url,
        metadata,
        mode: 'payment',
      }),
    });

    const data = await response.json();
    console.log('Thawani API Response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
