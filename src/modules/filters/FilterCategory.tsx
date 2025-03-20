
import React, { useState, useEffect, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FilterCategoryProps } from './types/filterTypes';
import RangeFilter from './components/RangeFilter';
import CheckboxFilter from './components/CheckboxFilter';
import RadioFilter from './components/RadioFilter';

const FilterCategory: React.FC<FilterCategoryProps> = ({
  title,
  options,
  type,
  initialExpanded = true,
  rangeMin = 0,
  rangeMax = 100,
  rangeUnit = '',
  currentMin,
  currentMax,
  selectedOptions = [],
  onSelectionChange,
  onRangeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [selected, setSelected] = useState<string[]>(selectedOptions);
  const [minValue, setMinValue] = useState(currentMin ?? rangeMin);
  const [maxValue, setMaxValue] = useState(currentMax ?? rangeMax);
  
  // Synchronize with external selected options when they change
  useEffect(() => {
    if (JSON.stringify(selectedOptions) !== JSON.stringify(selected)) {
      setSelected(selectedOptions);
    }
  }, [selectedOptions]);
  
  // Synchronize with external range values when they change
  useEffect(() => {
    if (currentMin !== undefined && currentMin !== minValue) {
      setMinValue(currentMin);
    }
    if (currentMax !== undefined && currentMax !== maxValue) {
      setMaxValue(currentMax);
    }
  }, [currentMin, currentMax]);
  
  // Toggle expansion
  const toggleExpand = () => setIsExpanded(prev => !prev);
  
  // Handle selection change with debounce to prevent multiple API calls
  const handleSelectionChange = (newSelected: string[]) => {
    setSelected(newSelected);
    
    // Use setTimeout to batch multiple selections before triggering the callback
    setTimeout(() => {
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
    }, 0);
  };
  
  // Handle range change
  const handleRangeChange = (min: number, max: number) => {
    setMinValue(min);
    setMaxValue(max);
    if (onRangeChange) {
      onRangeChange(min, max);
    }
  };
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex items-center justify-between w-full text-left"
        onClick={toggleExpand}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isExpanded ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {type === 'range' ? (
            <RangeFilter
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              rangeUnit={rangeUnit}
              currentMin={minValue}
              currentMax={maxValue}
              onRangeChange={handleRangeChange}
            />
          ) : type === 'radio' ? (
            <RadioFilter
              options={options}
              selectedOptions={selected}
              onSelectionChange={handleSelectionChange}
            />
          ) : (
            <CheckboxFilter
              options={options}
              selectedOptions={selected}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Memorize the component to prevent unnecessary rerenders
export default memo(FilterCategory);
