
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
  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);
  
  // Update local state when props change (for example when filter data loads)
  useEffect(() => {
    setMinValue(currentMin);
    setMaxValue(currentMax);
  }, [currentMin, currentMax]);
  
  // Handle minimum value change with debouncing
  const handleMinChange = (value: number) => {
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, maxValue - 1);
    setMinValue(newMin);
    // Directly trigger the change to avoid delay
    onRangeChange(newMin, maxValue);
  };
  
  // Handle maximum value change with debouncing
  const handleMaxChange = (value: number) => {
    // Ensure max doesn't go below min
    const newMax = Math.max(value, minValue + 1);
    setMaxValue(newMax);
    // Directly trigger the change to avoid delay
    onRangeChange(minValue, newMax);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{minValue} {rangeUnit}</span>
        <span>{maxValue} {rangeUnit}</span>
      </div>
      
      <div className="pt-2 pb-6">
        <Slider
          defaultValue={[minValue]}
          min={rangeMin}
          max={rangeMax}
          step={1}
          value={[minValue]}
          onValueChange={(values) => handleMinChange(values[0])}
          className="mb-4"
        />
        
        <Slider
          defaultValue={[maxValue]}
          min={rangeMin}
          max={rangeMax}
          step={1}
          value={[maxValue]}
          onValueChange={(values) => handleMaxChange(values[0])}
        />
      </div>
    </div>
  );
};

export default RangeFilter;
