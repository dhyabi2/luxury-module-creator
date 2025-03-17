
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

interface UseDebouncedFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

export const useDebouncedFilters = ({ onFilterChange }: UseDebouncedFiltersProps) => {
  // Flag to track if we have pending filter changes
  const [pendingFilters, setPendingFilters] = useState<boolean>(false);
  
  // Create a single debounced function that doesn't change on every render
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>, isUpdating: React.MutableRefObject<boolean>) => {
      if (onFilterChange && !isUpdating.current) {
        console.log('[useDebouncedFilters] Applying debounced filters:', filters);
        onFilterChange(filters);
        setPendingFilters(false);
      }
    // Increased debounce time to reduce API calls
    }, 500),
    [onFilterChange]
  );
  
  return {
    pendingFilters,
    setPendingFilters,
    debouncedFilterChange
  };
};
