
import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Use a ref to track if we're in the middle of a batch update
  const isUpdating = useRef(false);
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
    if (filtersData && !isUpdating.current) {
      isUpdating.current = true;
      
      const updates: Record<string, any> = {};
      let hasUpdates = false;
      
      if (!initialFilters.priceRange) {
        updates.priceRange = {
          min: filtersData.priceRange.min,
          max: filtersData.priceRange.max
        };
        hasUpdates = true;
      }
      
      if (!initialFilters.caseSizeRange) {
        updates.caseSizeRange = {
          min: filtersData.caseSizeRange.min,
          max: filtersData.caseSizeRange.max
        };
        hasUpdates = true;
      }
      
      if (hasUpdates) {
        if (updates.priceRange) {
          setPriceRange(updates.priceRange);
        }
        
        if (updates.caseSizeRange) {
          setCaseSizeRange(updates.caseSizeRange);
        }
      }
      
      // Use setTimeout to ensure this happens after all state updates
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  }, [filtersData, initialFilters]);
  
  // Create a debounced version that doesn't change on every render
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>) => {
      if (onFilterChange && !isUpdating.current) {
        console.log('[useFilterSelection] Applying debounced filters:', filters);
        onFilterChange(filters);
        setPendingFilters(false);
      }
    }, 500),
    [onFilterChange]
  );
  
  // Batch all filter changes together to prevent multiple API calls
  const applyFilters = useCallback(() => {
    if (isUpdating.current) {
      console.log('[useFilterSelection] Skipping filter update while batch updating');
      return;
    }
    
    console.log('[useFilterSelection] Filter state changed, preparing update');
    setPendingFilters(true);
    
    const filters = {
      ...selectedOptions,
      priceRange,
      caseSizeRange
    };
    
    console.log('[useFilterSelection] Filters to be applied (debounced):', filters);
    debouncedFilterChange(filters);
  }, [selectedOptions, priceRange, caseSizeRange, debouncedFilterChange]);
  
  // Apply filters when state changes, but only if we're not in a batch update
  useEffect(() => {
    if (!isUpdating.current) {
      applyFilters();
    }
    
    return () => {
      console.log('[useFilterSelection] Cleanup - cancelling debounced filter change');
      debouncedFilterChange.cancel();
    };
  }, [selectedOptions, priceRange, caseSizeRange, applyFilters, debouncedFilterChange]);
  
  const handleSelectionChange = (category: string, selected: string[]) => {
    console.log(`[useFilterSelection] Selection changed for ${category}:`, selected);
    isUpdating.current = true;
    
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected
    }));
    
    // Allow state to settle before applying filters
    setTimeout(() => {
      isUpdating.current = false;
      applyFilters();
    }, 0);
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    console.log(`[useFilterSelection] Price range changed: ${min}-${max}`);
    isUpdating.current = true;
    
    setPriceRange({ min, max });
    
    // Allow state to settle before applying filters
    setTimeout(() => {
      isUpdating.current = false;
      applyFilters();
    }, 0);
  };
  
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    console.log(`[useFilterSelection] Case size range changed: ${min}-${max}`);
    isUpdating.current = true;
    
    setCaseSizeRange({ min, max });
    
    // Allow state to settle before applying filters
    setTimeout(() => {
      isUpdating.current = false;
      applyFilters();
    }, 0);
  };
  
  const handleClearFilters = () => {
    console.log('[useFilterSelection] Clearing all filters');
    isUpdating.current = true;
    
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
    
    // Allow state to settle before applying filters
    setTimeout(() => {
      isUpdating.current = false;
      applyFilters();
    }, 0);
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
