
import { supabase } from "@/integrations/supabase/client";

// Database operations for filters
export const filtersDb = {
  getAll: async (category: string = '') => {
    console.log(`DB: Getting filters${category ? ` for category: ${category}` : ''}`);
    
    try {
      const { data, error } = await supabase
        .from('filters')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching filters data:', error);
        throw error;
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in filtersDb.getAll:', error);
      throw error;
    }
  }
};
