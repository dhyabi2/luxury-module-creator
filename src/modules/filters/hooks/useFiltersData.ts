
import { useState, useEffect } from 'react';
import { FiltersData } from '@/lib/db/filters/types';

export const useFiltersData = () => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFilters = async () => {
    if (isLoading === false && filtersData !== null) return;
    
    setIsLoading(true);
    console.log('[useFiltersData] Starting filters data fetch');
    
    console.log('[useFiltersData] Sending request to /api/filters');
    
    try {
      const response = await fetch('/api/filters');
      
      // Let error responses propagate
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[useFiltersData] Server responded with error (${response.status}): ${errorText.substring(0, 150)}...`);
        throw new Error(`Failed to fetch filters: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      console.log('[useFiltersData] Filters data received:', data);
      
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
