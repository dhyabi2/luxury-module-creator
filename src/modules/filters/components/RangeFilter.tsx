
import React, { useState, useEffect } from 'react';
import { RangeFilterProps } from '../types/filterTypes';
import { Slider } from '@/components/ui/slider';

const RangeFilter: React.FC<RangeFilterProps> = ({
  rangeMin,
  rangeMax,
  rangeUnit,
  currentMin,
  currentMax,
  onRangeChange
}) => {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);
  
  // Update local state when props change (for example when filter data loads)
  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);
  
  // Handle minimum value change
  const handleMinChange = (value: number) => {
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, localMax - 1);
    setLocalMin(newMin);
    onRangeChange(newMin, localMax);
  };
  
  // Handle maximum value change
  const handleMaxChange = (value: number) => {
    // Ensure max doesn't go below min
    const newMax = Math.max(value, localMin + 1);
    setLocalMax(newMax);
    onRangeChange(localMin, newMax);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{localMin} {rangeUnit}</span>
        <span>{localMax} {rangeUnit}</span>
      </div>
      
      <div className="pt-2 pb-6">
        <Slider
          defaultValue={[localMin]}
          min={rangeMin}
          max={rangeMax}
          step={1}
          value={[localMin]}
          onValueChange={(values) => handleMinChange(values[0])}
          className="mb-4"
        />
        
        <Slider
          defaultValue={[localMax]}
          min={rangeMin}
          max={rangeMax}
          step={1}
          value={[localMax]}
          onValueChange={(values) => handleMaxChange(values[0])}
        />
      </div>
    </div>
  );
};

export default RangeFilter;
