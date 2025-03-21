
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[update-logo] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Log request details
  console.log('[update-logo] Request received from:', req.headers.get('origin') || 'unknown origin');
  console.log('[update-logo] Request method:', req.method);
  
  try {
    // Update the logo in the settings table
    const logoUrl = "https://cdn-iicfd.nitrocdn.com/HlkbfeOkMsuGJIhigodBlPxupvwkWuYp/assets/images/optimized/rev-4b911b6/mnkwatches.store/wp-content/uploads/2022/03/ezgif.com-gif-maker-3-1.png";
    
    console.log('[update-logo] Updating logo to:', logoUrl);
    
    const { data, error } = await supabase
      .from('settings')
      .update({ logo_url: logoUrl })
      .eq('id', 1); // Assuming settings has an ID of 1
      
    if (error) {
      console.error('[update-logo] Error updating logo:', error);
      throw error;
    }
    
    console.log('[update-logo] Logo updated successfully');
    
    // Return success response
    return new Response(JSON.stringify({ success: true, message: 'Logo updated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[update-logo] Error processing request:', error);
    console.error('[update-logo] Error details:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
