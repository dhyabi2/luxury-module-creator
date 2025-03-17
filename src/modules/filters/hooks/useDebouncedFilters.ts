import { useCallback, useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

interface UseDebouncedFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  debounceTime?: number;
}

/**
 * Hook for managing debounced filter applications to prevent excessive API calls
 * 
 * @param onFilterChange - Callback when filters should be applied
 * @param debounceTime - Optional debounce time in ms (default: 500)
 */
export const useDebouncedFilters = ({ 
  onFilterChange,
  debounceTime = 500 
}: UseDebouncedFiltersProps) => {
  // Flag to track if we have pending filter changes
  const [pendingFilters, setPendingFilters] = useState<boolean>(false);
  
  // Keep track of the last filters that were applied
  const lastAppliedFilters = useRef<Record<string, any> | null>(null);
  
  // Create a single debounced function that doesn't change on every render
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>, isUpdating: React.MutableRefObject<boolean>) => {
      if (!onFilterChange) {
        console.log('[useDebouncedFilters] No onFilterChange callback provided');
        setPendingFilters(false);
        return;
      }
      
      if (isUpdating.current) {
        console.log('[useDebouncedFilters] Skipping filter application while batch updating');
        return;
      }
      
      // Check if filters actually changed
      const filtersString = JSON.stringify(filters);
      const lastFiltersString = lastAppliedFilters.current ? JSON.stringify(lastAppliedFilters.current) : null;
      
      if (filtersString === lastFiltersString) {
        console.log('[useDebouncedFilters] Filters unchanged, skipping application');
        setPendingFilters(false);
        return;
      }
      
      console.log('[useDebouncedFilters] Applying debounced filters:', filters);
      
      try {
        onFilterChange(filters);
        lastAppliedFilters.current = filters;
      } catch (error) {
        console.error('[useDebouncedFilters] Error applying filters:', error);
      } finally {
        setPendingFilters(false);
      }
    }, debounceTime),
    [onFilterChange, debounceTime]
  );
  
  // Ensure proper cleanup
  useEffect(() => {
    return () => {
      console.log('[useDebouncedFilters] Cleanup - cancelling debounced filter change');
      debouncedFilterChange.cancel();
    };
  }, [debouncedFilterChange]);
  
  return {
    pendingFilters,
    setPendingFilters,
    debouncedFilterChange,
    lastAppliedFilters
  };
};
