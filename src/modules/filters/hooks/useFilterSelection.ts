
import { useCallback, useEffect } from 'react';
import { FiltersData } from '@/lib/db/filters/types';
import { useBatchUpdates } from './useBatchUpdates';
import { usePriceRangeFilter } from './usePriceRangeFilter';
import { useCaseSizeFilter } from './useCaseSizeFilter';
import { useCategorySelection } from './useCategorySelection';
import { useDebouncedFilters } from './useDebouncedFilters';

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
  // Use the batch updates hook
  const { isUpdating, startBatchUpdate, endBatchUpdate } = useBatchUpdates();
  
  // Handle filter changes with debouncing
  const { pendingFilters, setPendingFilters, debouncedFilterChange } = useDebouncedFilters({ onFilterChange });
  
  // Trigger filter application when needed
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
    debouncedFilterChange(filters, isUpdating);
  }, [debouncedFilterChange, setPendingFilters, isUpdating]);
  
  // Initialize category selection state
  const { 
    selectedOptions, 
    setSelectedOptions, 
    handleSelectionChange: handleCategorySelectionChange 
  } = useCategorySelection({ 
    initialSelections: initialFilters,
    onUpdate: applyFilters
  });
  
  // Initialize price range state
  const { 
    priceRange, 
    handlePriceRangeChange: handlePriceChange,
    initPriceRangeFromData: initPriceRange
  } = usePriceRangeFilter({ 
    initialRange: initialFilters.priceRange,
    filtersData,
    onUpdate: applyFilters
  });
  
  // Initialize case size range state
  const { 
    caseSizeRange, 
    handleCaseSizeRangeChange: handleCaseSizeChange,
    initCaseSizeRangeFromData: initCaseSizeRange
  } = useCaseSizeFilter({ 
    initialRange: initialFilters.caseSizeRange,
    filtersData,
    onUpdate: applyFilters
  });
  
  // Wrapper for selection change to handle batching
  const handleSelectionChange = useCallback((category: string, selected: string[]) => {
    startBatchUpdate();
    handleCategorySelectionChange(category, selected);
    endBatchUpdate(applyFilters);
  }, [handleCategorySelectionChange, startBatchUpdate, endBatchUpdate, applyFilters]);
  
  // Wrapper for price range change to handle batching
  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    startBatchUpdate();
    handlePriceChange(min, max);
    endBatchUpdate(applyFilters);
  }, [handlePriceChange, startBatchUpdate, endBatchUpdate, applyFilters]);
  
  // Wrapper for case size range change to handle batching
  const handleCaseSizeRangeChange = useCallback((min: number, max: number) => {
    startBatchUpdate();
    handleCaseSizeChange(min, max);
    endBatchUpdate(applyFilters);
  }, [handleCaseSizeChange, startBatchUpdate, endBatchUpdate, applyFilters]);
  
  // Clear all filters function
  const handleClearFilters = useCallback(() => {
    console.log('[useFilterSelection] Clearing all filters');
    startBatchUpdate();
    
    setSelectedOptions({});
    
    if (filtersData) {
      console.log('[useFilterSelection] Resetting price and case size ranges to defaults');
      if (filtersData.priceRange) {
        handlePriceChange(filtersData.priceRange.min, filtersData.priceRange.max);
      }
      
      if (filtersData.caseSizeRange) {
        handleCaseSizeChange(filtersData.caseSizeRange.min, filtersData.caseSizeRange.max);
      }
    }
    
    endBatchUpdate(applyFilters);
  }, [
    setSelectedOptions, 
    handlePriceChange, 
    handleCaseSizeChange, 
    filtersData, 
    startBatchUpdate, 
    endBatchUpdate,
    applyFilters
  ]);
  
  // Update price and case size ranges when filtersData changes
  useEffect(() => {
    if (filtersData && !isUpdating.current) {
      startBatchUpdate();
      
      let hasUpdates = false;
      
      if (initPriceRange(filtersData)) {
        hasUpdates = true;
      }
      
      if (initCaseSizeRange(filtersData)) {
        hasUpdates = true;
      }
      
      endBatchUpdate(hasUpdates ? applyFilters : undefined);
    }
  }, [filtersData, initPriceRange, initCaseSizeRange, startBatchUpdate, endBatchUpdate, applyFilters]);
  
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
