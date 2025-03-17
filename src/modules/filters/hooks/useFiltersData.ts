
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FiltersData } from '@/lib/db/filters/types';

export const useFiltersData = () => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFilters = async () => {
    if (isLoading === false && filtersData !== null) return;
    
    setIsLoading(true);
    console.log('[useFiltersData] Starting filters data fetch');
    
    try {
      console.log('[useFiltersData] Sending request to /api/filters');
      
      const response = await fetch('/api/filters');
      
      // Check if the response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error('[useFiltersData] Server responded with error:', response.status, text.substring(0, 100) + '...');
        throw new Error(`Failed to fetch filters: ${response.status}`);
      }
      
      // Try to parse as JSON and validate the response format
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[useFiltersData] Failed to parse JSON response:', responseText.substring(0, 100) + '...');
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('[useFiltersData] Filters data received:', data);
      
      // Validate the data has the expected structure
      if (!data || typeof data !== 'object') {
        console.error('[useFiltersData] Invalid filters data format');
        throw new Error('Invalid filters data format');
      }
      
      // Create category-specific brand mappings if not present
      if (!data.categoryBrands) {
        console.log('[useFiltersData] Creating category-specific brand mappings');
        data.categoryBrands = {
          'watches': data.brands.filter((brand: any) => 
            ['aigner', 'calvinKlein', 'michaelKors', 'tissot'].includes(brand.id)),
          'accessories': data.brands.filter((brand: any) => 
            ['aigner', 'michaelKors'].includes(brand.id)),
          'bags': data.brands.filter((brand: any) => 
            ['aigner', 'michaelKors'].includes(brand.id)),
          'perfumes': data.brands.filter((brand: any) => 
            ['calvinKlein'].includes(brand.id))
        };
      }
      
      setFiltersData(data);
    } catch (error) {
      console.error('[useFiltersData] Error fetching filters:', error);
      
      // Fall back to default filters if we have any cached
      if (!filtersData) {
        console.log('[useFiltersData] Using fallback default filters');
        // We could set some default filters here if needed
      }
      
      toast.error('Failed to load filters. Please try again.');
    } finally {
      console.log('[useFiltersData] Filters fetch completed');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  return { filtersData, isLoading, fetchFilters };
};
