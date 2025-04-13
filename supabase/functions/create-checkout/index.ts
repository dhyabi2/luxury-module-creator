
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0@2023-11-30";

// Completely open CORS headers - no restrictions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:create-checkout] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Get the request body
  let reqData;
  try {
    reqData = await req.json();
  } catch (error) {
    console.error('[API:create-checkout] Error parsing request body:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Extract data from request  
  const { 
    items = [], 
    mode = 'payment',
    successUrl = 'https://example.com/success',
    cancelUrl = 'https://example.com/cancel'
  } = reqData;
  
  console.log('[API:create-checkout] Request received with items:', items);
  
  if (!items || items.length === 0) {
    console.error('[API:create-checkout] No items provided in request');
    return new Response(
      JSON.stringify({ error: 'No items provided in request' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Initialize Stripe
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_51OuGdHD0SSpz8x1Jb6h0ix7hSU3cQH1K61Ng6S3WaIqQonDMFJ1nCNTGPsP2rQrbSfwKqYt7cefm2MWNQbPdybaV00Qrmu1ZbW';
  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

  try {
    // Prepare line items for Stripe from the request items
    const lineItems = items.map((item: any) => {
      const unitAmount = Math.round(item.price * 100); // Convert to cents
      
      return {
        price_data: {
          currency: item.currency?.toLowerCase() || 'omr',
          product_data: {
            name: `${item.brand} ${item.name}`,
            images: item.image ? [item.image] : [],
            metadata: {
              productId: item.id
            }
          },
          unit_amount: unitAmount
        },
        quantity: item.quantity
      };
    });
    
    console.log('[API:create-checkout] Creating Stripe session with line items:', lineItems);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: mode,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        origin: 'direct_checkout'
      }
    });

    console.log('[API:create-checkout] Created Stripe session:', session.id);
    
    // Return the checkout session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[API:create-checkout] Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
