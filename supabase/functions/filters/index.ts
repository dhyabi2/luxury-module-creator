
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default filters data in case it's not available in the database
const defaultFilters = {
  priceRange: {
    min: 0,
    max: 1225,
    unit: "$"
  },
  categories: [
    { id: "watches", name: "Watches", count: 45 },
    { id: "accessories", name: "Accessories", count: 12 }
  ],
  brands: [
    { id: "timex", name: "Timex", count: 8 },
    { id: "rolex", name: "Rolex", count: 15 },
    { id: "seiko", name: "Seiko", count: 12 }
  ],
  categoryBrands: {
    "watches": [
      { id: "timex", name: "Timex", count: 8 },
      { id: "rolex", name: "Rolex", count: 15 },
      { id: "seiko", name: "Seiko", count: 12 }
    ],
    "accessories": [
      { id: "gucci", name: "Gucci", count: 5 },
      { id: "prada", name: "Prada", count: 7 }
    ]
  },
  bands: [
    { id: "leather", name: "Leather", count: 25 },
    { id: "metal", name: "Metal", count: 20 }
  ],
  caseColors: [
    { id: "gold", name: "Gold", count: 15 },
    { id: "silver", name: "Silver", count: 30 }
  ],
  colors: [
    { id: "black", name: "Black", count: 18 },
    { id: "brown", name: "Brown", count: 12 }
  ],
  genders: [
    { id: "men", name: "Men", count: 30 },
    { id: "women", name: "Women", count: 25 },
    { id: "unisex", name: "Unisex", count: 10 }
  ],
  caseSizeRange: {
    min: 20,
    max: 45,
    unit: "mm"
  }
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

  console.log('[API:filters] Request received');

  try {
    // Fetch filters from the database
    const { data, error } = await supabase
      .from('filters')
      .select('data')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching filters from database:', error);
      // Return default filters if database query fails
      return new Response(JSON.stringify(defaultFilters), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!data || !data.data) {
      console.log('[API:filters] No filters found in database, using default filters');
      return new Response(JSON.stringify(defaultFilters), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the data if it's a string
    let filtersData;
    if (typeof data.data === 'string') {
      try {
        filtersData = JSON.parse(data.data);
      } catch (e) {
        console.error('Error parsing filters data:', e);
        filtersData = defaultFilters;
      }
    } else {
      filtersData = data.data;
    }
    
    // Validate the filters data structure
    if (!filtersData.priceRange || !filtersData.categories || !filtersData.brands) {
      console.error('Invalid filters data structure');
      filtersData = defaultFilters;
    }
    
    return new Response(JSON.stringify(filtersData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in filters function:', error);
    
    // Return default filters on error
    return new Response(JSON.stringify(defaultFilters), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
