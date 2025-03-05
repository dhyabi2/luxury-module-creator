
import { supabase } from "@/integrations/supabase/client";
import { FiltersResponse } from "@/types/api";

// Default filter data if none exists in database
const defaultFilters: FiltersResponse = {
  priceRange: { min: 0, max: 1000, unit: 'OMR' },
  categories: [
    { id: 'watches', name: 'Watches', count: 32 },
    { id: 'men', name: 'Men', count: 18 },
    { id: 'women', name: 'Women', count: 14 }
  ],
  brands: [
    { id: 'aigner', name: 'AIGNER', count: 12 },
    { id: 'calvinKlein', name: 'Calvin Klein', count: 8 },
    { id: 'michaelKors', name: 'Michael Kors', count: 7 },
    { id: 'tissot', name: 'TISSOT', count: 5 }
  ],
  bands: [
    { id: 'leather', name: 'Leather', count: 15 },
    { id: 'stainlessSteel', name: 'Stainless Steel', count: 12 },
    { id: 'rubber', name: 'Rubber', count: 5 }
  ],
  caseColors: [
    { id: 'goldPlated', name: 'Gold Plated', count: 8 },
    { id: 'stainlessSteel', name: 'Stainless Steel', count: 12 },
    { id: 'roseGoldPlated', name: 'Rose Gold Plated', count: 6 },
    { id: 'titanium', name: 'Titanium', count: 4 }
  ],
  colors: [
    { id: 'black', name: 'Black', count: 10 },
    { id: 'silver', name: 'Silver', count: 9 },
    { id: 'gold', name: 'Gold', count: 7 },
    { id: 'brown', name: 'Brown', count: 6 },
    { id: 'blue', name: 'Blue', count: 4 }
  ],
  caseSizeRange: { min: 20, max: 45, unit: 'mm' }
};

// Database operations for filters
export const filtersDb = {
  getAll: async (category: string = ''): Promise<FiltersResponse> => {
    console.log(`DB: Getting filters${category ? ` for category: ${category}` : ''}`);
    
    try {
      // First try to get filters from database
      const { data, error } = await supabase
        .from('filters')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching filters data:', error);
        throw error;
      }
      
      // If no data found, add default filters to database and return them
      if (!data) {
        console.warn('No filters data found, using defaults');
        
        try {
          // Try to insert default filters
          const { error: insertError } = await supabase
            .from('filters')
            .insert({ data: defaultFilters });
            
          if (insertError) {
            console.error('Error inserting default filters:', insertError);
          } else {
            console.log('Default filters added to database');
          }
        } catch (insertErr) {
          console.error('Failed to insert default filters:', insertErr);
        }
        
        return defaultFilters;
      }
      
      // Return filters data from database - ensure proper typing
      return data.data as FiltersResponse || defaultFilters;
    } catch (error) {
      console.error('Error in filtersDb.getAll:', error);
      // In case of error, return default filters to ensure UI works
      return defaultFilters;
    }
  }
};
