
// Import the correct Deno standard library HTTP server module
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const THAWANI_API_BASE_URL = 'https://uatcheckout.thawani.om/api/v1';
const THAWANI_SECRET_KEY = 'rRQ26GcsZzoEhbrP2HZvLYDbn9C9et';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('Received request to create-thawani-session');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request with CORS headers');
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const requestData = await req.json();
    console.log('Request data:', JSON.stringify(requestData));
    
    const { products, success_url, cancel_url, metadata } = requestData;

    console.log('Creating Thawani session with products:', JSON.stringify(products));
    console.log('Success URL:', success_url);
    console.log('Cancel URL:', cancel_url);

    const requestBody = {
      client_reference_id: `order_${Date.now()}`,
      products,
      success_url,
      cancel_url,
      metadata,
      mode: 'payment',
    };
    console.log('Thawani request body:', JSON.stringify(requestBody));

    console.log('Sending request to Thawani API...');
    const response = await fetch(`${THAWANI_API_BASE_URL}/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': THAWANI_SECRET_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Thawani API response status:', response.status);
    const data = await response.json();
    console.log('Thawani API response data:', JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-thawani-session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
