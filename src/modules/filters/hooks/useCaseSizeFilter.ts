
import { useState, useCallback } from 'react';
import { FiltersData } from '@/lib/db/filters/types';

interface UseCaseSizeFilterProps {
  initialRange?: { min: number, max: number };
  filtersData: FiltersData | null;
  onUpdate?: () => void;
}

export const useCaseSizeFilter = ({ 
  initialRange,
  filtersData,
  onUpdate
}: UseCaseSizeFilterProps) => {
  const [caseSizeRange, setCaseSizeRange] = useState<{min: number, max: number}>({ 
    min: initialRange?.min || 20, 
    max: initialRange?.max || 45 
  });

  // Initialize case size range from filters data if not already set
  const initCaseSizeRangeFromData = useCallback((data: FiltersData) => {
    if (!initialRange && data.caseSizeRange) {
      setCaseSizeRange({
        min: data.caseSizeRange.min,
        max: data.caseSizeRange.max
      });
      return true;
    }
    return false;
  }, [initialRange]);

  // Handler for case size range changes
  const handleCaseSizeRangeChange = useCallback((min: number, max: number) => {
    console.log(`[useCaseSizeFilter] Case size range changed: ${min}-${max}`);
    setCaseSizeRange({ min, max });
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  return {
    caseSizeRange,
    setCaseSizeRange,
    handleCaseSizeRangeChange,
    initCaseSizeRangeFromData
  };
};
