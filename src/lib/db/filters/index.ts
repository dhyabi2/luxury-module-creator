
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { FiltersResponse } from "@/types/api";
import { FiltersData } from "./types";
import { generateFilters } from "./generator";
import { defaultFilters } from "./defaultValues";

// Database operations for filters
export const filtersDb = {
  getAll: async (): Promise<FiltersData> => {
    console.log('[DB:filters] Getting all filters');
    
    try {
      // Fetch the filters data from Supabase
      const { data, error } = await supabase
        .from('filters')
        .select('data')
        .single();
      
      if (error) {
        console.error('[DB:filters] Error fetching filters:', error);
        
        // If filters don't exist yet in the database, generate and return default data
        console.log('[DB:filters] Generating default filters');
        
        // Build filter data by querying products table
        const filtersData = await generateFilters();
        
        return filtersData;
      }
      
      console.log('[DB:filters] Filters data retrieved successfully');
      
      // Parse the data with proper type handling
      let parsedData: FiltersData;
      
      if (typeof data.data === 'string') {
        // If it's a string, parse it and validate structure
        try {
          const parsed = JSON.parse(data.data);
          // Validate that parsed data has the necessary structure before casting
          if (validateFiltersData(parsed)) {
            parsedData = parsed as FiltersData;
          } else {
            throw new Error('Invalid data structure in parsed JSON');
          }
        } catch (parseError) {
          console.error('[DB:filters] Error parsing filters data:', parseError);
          return generateFilters();
        }
      } else if (data.data && typeof data.data === 'object') {
        // If it's already an object, validate its structure
        const jsonData = data.data as Record<string, unknown>;
        if (validateFiltersData(jsonData)) {
          parsedData = jsonData as unknown as FiltersData;
        } else {
          console.error('[DB:filters] Invalid data structure in database');
          return generateFilters();
        }
      } else {
        console.error('[DB:filters] Unexpected data format');
        return generateFilters();
      }
        
      return parsedData;
    } catch (error) {
      console.error('[DB:filters] Unexpected error in filtersDb.getAll:', error);
      
      // Return default filters as fallback
      return generateFilters();
    }
  },
  
  generateFilters
};

/**
 * Validates that the parsed data has the necessary structure
 */
function validateFiltersData(data: any): data is FiltersData {
  return data && 
    typeof data === 'object' && 
    data.priceRange && 
    Array.isArray(data.categories) && 
    Array.isArray(data.brands) && 
    data.categoryBrands &&
    typeof data.categoryBrands === 'object' &&
    Array.isArray(data.bands) &&
    Array.isArray(data.caseColors) &&
    Array.isArray(data.colors) &&
    data.caseSizeRange &&
    typeof data.caseSizeRange === 'object';
}
