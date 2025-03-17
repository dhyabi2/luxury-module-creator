
import { useState, useCallback } from 'react';
import { FiltersData } from '@/lib/db/filters/types';

interface UsePriceRangeFilterProps {
  initialRange?: { min: number, max: number };
  filtersData: FiltersData | null;
  onUpdate?: () => void;
}

export const usePriceRangeFilter = ({ 
  initialRange,
  filtersData,
  onUpdate
}: UsePriceRangeFilterProps) => {
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ 
    min: initialRange?.min || 0, 
    max: initialRange?.max || 1225 
  });

  // Initialize price range from filters data if not already set
  const initPriceRangeFromData = useCallback((data: FiltersData) => {
    if (!initialRange && data.priceRange) {
      setPriceRange({
        min: data.priceRange.min,
        max: data.priceRange.max
      });
      return true;
    }
    return false;
  }, [initialRange]);

  // Handler for price range changes
  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    console.log(`[usePriceRangeFilter] Price range changed: ${min}-${max}`);
    setPriceRange({ min, max });
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  return {
    priceRange,
    setPriceRange,
    handlePriceRangeChange,
    initPriceRangeFromData
  };
};
