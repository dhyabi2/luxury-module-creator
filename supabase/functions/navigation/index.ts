
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default navigation data in case it's not available in the database
const defaultNavigation = {
  mainCategories: [
    { id: "watches", name: "Watches", active: true },
    { id: "accessories", name: "Accessories", active: false }
  ],
  secondaryCategories: [
    { id: "newin", name: "New In", highlight: true },
    { id: "sale", name: "Sale", highlight: true }
  ],
  featuredBrands: [
    { id: "rolex", name: "Rolex", featured: true },
    { id: "omega", name: "Omega", featured: true }
  ]
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('[API:navigation] Request received');

  try {
    // Fetch navigation from the database
    const { data, error } = await supabase
      .from('navigation')
      .select('data')
      .eq('type', 'main')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching navigation from database:', error);
      // Return default navigation if database query fails
      return new Response(JSON.stringify(defaultNavigation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!data || !data.data) {
      console.log('[API:navigation] No navigation found in database, using default navigation');
      return new Response(JSON.stringify(defaultNavigation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the data if it's a string
    let navigationData;
    if (typeof data.data === 'string') {
      try {
        navigationData = JSON.parse(data.data);
      } catch (e) {
        console.error('Error parsing navigation data:', e);
        navigationData = defaultNavigation;
      }
    } else {
      navigationData = data.data;
    }
    
    // Validate the navigation data structure
    if (!navigationData.mainCategories || !navigationData.secondaryCategories) {
      console.error('Invalid navigation data structure');
      navigationData = defaultNavigation;
    }
    
    return new Response(JSON.stringify(navigationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in navigation function:', error);
    
    // Return default navigation on error
    return new Response(JSON.stringify(defaultNavigation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
