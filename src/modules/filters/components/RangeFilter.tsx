
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
  // Track both values in a single array for smoother interaction
  const [values, setValues] = useState<[number, number]>([currentMin, currentMax]);
  
  // Update local state when props change (for example when filter data loads)
  useEffect(() => {
    setValues([currentMin, currentMax]);
  }, [currentMin, currentMax]);
  
  // Handle range change with a single slider
  const handleRangeChange = (newValues: number[]) => {
    if (newValues.length === 2) {
      const [newMin, newMax] = newValues as [number, number];
      setValues([newMin, newMax]);
      onRangeChange(newMin, newMax);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{values[0]} {rangeUnit}</span>
        <span>{values[1]} {rangeUnit}</span>
      </div>
      
      <div className="py-6">
        <Slider
          defaultValue={values}
          min={rangeMin}
          max={rangeMax}
          step={1}
          value={values}
          onValueChange={handleRangeChange}
          className="mb-4"
        />
      </div>
    </div>
  );
};

export default RangeFilter;
