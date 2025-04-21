
import { useState } from 'react';

export function usePriceRangeState(initialPriceRange: { min: number; max: number }) {
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  
  return {
    priceRange,
    setPriceRange
  };
}
