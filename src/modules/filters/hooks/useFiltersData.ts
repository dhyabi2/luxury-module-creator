
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
      
      if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('[useFiltersData] Filters data received:', data);
      
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
