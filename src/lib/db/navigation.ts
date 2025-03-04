
import { supabase } from "@/integrations/supabase/client";

// Database operations for navigation
export const navigationDb = {
  getAll: async () => {
    console.log('DB: Getting all navigation data');
    
    try {
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .eq('type', 'all')
        .single();
      
      if (error) {
        console.error('Error fetching navigation data:', error);
        throw error;
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in navigationDb.getAll:', error);
      throw error;
    }
  }
};
