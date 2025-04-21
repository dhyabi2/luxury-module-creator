
import { useState, useEffect } from 'react';
import { usePriceRangeState } from './usePriceRangeState';
import { useSelectedOptions } from './useSelectedOptions';
import { fetchFiltersData, sendFilterSelection } from '../services/filtersService';
import { FiltersResponse } from '@/types/api';

interface UseFilterSidebarStateProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  categoryParam?: string;
}

export function useFilterSidebarState({ 
  onFilterChange, 
  initialFilters = {}, 
  categoryParam 
}: UseFilterSidebarStateProps) {
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { selectedOptions, setSelectedOptions } = useSelectedOptions(
    initialFilters.selectedOptions || {}
  );
  
  const { priceRange, setPriceRange } = usePriceRangeState(
    initialFilters.priceRange || { min: 0, max: 1000 }
  );
  
  // Fetch filters data on component mount
  useEffect(() => {
    const loadFiltersData = async () => {
      setIsLoading(true);
      const data = await fetchFiltersData(categoryParam);
      setFiltersData(data);
      
      if (data?.priceRange) {
        setPriceRange(data.priceRange);
      }
      
      setIsLoading(false);
    };
    
    loadFiltersData();
  }, [selectedOptions.categories, categoryParam]);
  
  // Update filters when selection changes
  useEffect(() => {
    if (onFilterChange) {
      const currentFilters = {
        selectedOptions,
        priceRange,
        categories: selectedOptions.categories || []
      };
      onFilterChange(currentFilters);
      sendFilterSelection(currentFilters);
    }
  }, [selectedOptions, priceRange, onFilterChange]);
  
  const handleClearFilters = () => {
    setSelectedOptions({});
    if (filtersData && filtersData.priceRange) {
      setPriceRange(filtersData.priceRange);
    }
  };
  
  return {
    filtersData,
    isLoading,
    selectedOptions,
    priceRange,
    handleClearFilters,
    setSelectedOptions,
    setPriceRange,
  };
}
