
import { supabase } from "@/integrations/supabase/client";

// Database operations for filters
export const filtersDb = {
  getAll: async (category: string = '') => {
    console.log(`DB: Getting filters${category ? ` for category: ${category}` : ''}`);
    
    try {
      const { data, error } = await supabase
        .from('filters')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching filters data:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No filters data found');
        return {
          priceRange: { min: 0, max: 1000, unit: 'OMR' },
          categories: [],
          brands: [],
          bands: [],
          caseColors: [],
          colors: [],
          caseSizeRange: { min: 20, max: 45, unit: 'mm' }
        };
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in filtersDb.getAll:', error);
      throw error;
    }
  }
};
