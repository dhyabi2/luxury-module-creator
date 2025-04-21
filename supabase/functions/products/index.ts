
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleProductsRequest } from './request-handler.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[API:products] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  return handleProductsRequest(req);
});
