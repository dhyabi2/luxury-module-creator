
import React from 'react';
import { RangeFilterProps } from '../types/filterTypes';

const RangeFilter: React.FC<RangeFilterProps> = ({
  rangeMin,
  rangeMax,
  rangeUnit,
  currentMin,
  currentMax,
  onRangeChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{currentMin} {rangeUnit}</span>
        <span>{currentMax} {rangeUnit}</span>
      </div>
      
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={currentMin}
        onChange={(e) => onRangeChange(parseInt(e.target.value), currentMax)}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={currentMax}
        onChange={(e) => onRangeChange(currentMin, parseInt(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default RangeFilter;
