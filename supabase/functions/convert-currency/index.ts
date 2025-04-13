
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('[API:convert-currency] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const requestData = await req.json();
    const { product, targetCurrency } = requestData;
    
    console.log(`[API:convert-currency] Converting product prices from ${product.currency} to ${targetCurrency}`);
    console.log('[API:convert-currency] Product before conversion:', product);
    
    // Exchange rate is fixed: 1 OMR = 2.60 USD
    const OMR_TO_USD_RATE = 2.60;
    
    // Create a copy of the product to avoid modifying the original
    const convertedProduct = {...product};
    
    // Only convert if currencies are different
    if (product.currency === 'OMR' && targetCurrency === '$') {
      // Convert price from OMR to USD
      convertedProduct.price = parseFloat((product.price * OMR_TO_USD_RATE).toFixed(2));
      convertedProduct.currency = '$';
      console.log(`[API:convert-currency] Converted price from OMR ${product.price} to $ ${convertedProduct.price}`);
    } else if (product.currency === '$' && targetCurrency === 'OMR') {
      // Convert price from USD to OMR
      convertedProduct.price = parseFloat((product.price / OMR_TO_USD_RATE).toFixed(2));
      convertedProduct.currency = 'OMR';
      console.log(`[API:convert-currency] Converted price from $ ${product.price} to OMR ${convertedProduct.price}`);
    } else {
      console.log('[API:convert-currency] No conversion needed or unsupported currency pair');
    }
    
    console.log('[API:convert-currency] Product after conversion:', convertedProduct);
    
    return new Response(
      JSON.stringify({ convertedProduct }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[API:convert-currency] Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
