
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { FiltersData } from '@/lib/db/filters/types';

interface UseFilterSelectionProps {
  initialFilters: Record<string, any>;
  filtersData: FiltersData | null;
  onFilterChange?: (filters: Record<string, any>) => void;
}

export const useFilterSelection = ({ 
  initialFilters, 
  filtersData, 
  onFilterChange 
}: UseFilterSelectionProps) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>(initialFilters);
  
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ 
    min: initialFilters.priceRange?.min || 0, 
    max: initialFilters.priceRange?.max || 1225 
  });
  
  const [caseSizeRange, setCaseSizeRange] = useState<{min: number, max: number}>({ 
    min: initialFilters.caseSizeRange?.min || 20, 
    max: initialFilters.caseSizeRange?.max || 45 
  });
  
  const [pendingFilters, setPendingFilters] = useState<boolean>(false);
  
  // Update price and case size ranges when filtersData changes
  useEffect(() => {
    if (filtersData) {
      if (!initialFilters.priceRange) {
        setPriceRange({
          min: filtersData.priceRange.min,
          max: filtersData.priceRange.max
        });
      }
      
      if (!initialFilters.caseSizeRange) {
        setCaseSizeRange({
          min: filtersData.caseSizeRange.min,
          max: filtersData.caseSizeRange.max
        });
      }
    }
  }, [filtersData, initialFilters]);
  
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>) => {
      if (onFilterChange) {
        console.log('[useFilterSelection] Applying debounced filters:', filters);
        onFilterChange(filters);
        setPendingFilters(false);
      }
    }, 500),
    [onFilterChange]
  );
  
  useEffect(() => {
    console.log('[useFilterSelection] Filter state changed, preparing update');
    setPendingFilters(true);
    
    const filters = {
      ...selectedOptions,
      priceRange,
      caseSizeRange
    };
    
    console.log('[useFilterSelection] Filters to be applied (debounced):', filters);
    debouncedFilterChange(filters);
    
    return () => {
      console.log('[useFilterSelection] Cleanup - cancelling debounced filter change');
      debouncedFilterChange.cancel();
    };
  }, [selectedOptions, priceRange, caseSizeRange, debouncedFilterChange]);
  
  const handleSelectionChange = (category: string, selected: string[]) => {
    console.log(`[useFilterSelection] Selection changed for ${category}:`, selected);
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected
    }));
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    console.log(`[useFilterSelection] Price range changed: ${min}-${max}`);
    setPriceRange({ min, max });
  };
  
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    console.log(`[useFilterSelection] Case size range changed: ${min}-${max}`);
    setCaseSizeRange({ min, max });
  };
  
  const handleClearFilters = () => {
    console.log('[useFilterSelection] Clearing all filters');
    setSelectedOptions({});
    
    if (filtersData) {
      console.log('[useFilterSelection] Resetting price and case size ranges to defaults');
      setPriceRange({
        min: filtersData.priceRange.min,
        max: filtersData.priceRange.max
      });
      
      setCaseSizeRange({
        min: filtersData.caseSizeRange.min,
        max: filtersData.caseSizeRange.max
      });
    }
  };
  
  return {
    selectedOptions,
    priceRange,
    caseSizeRange,
    pendingFilters,
    handleSelectionChange,
    handlePriceRangeChange,
    handleCaseSizeRangeChange,
    handleClearFilters
  };
};
