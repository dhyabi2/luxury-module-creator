
import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface FilterCategoryProps {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
  initialExpanded?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  rangeUnit?: string;
  currentMin?: number;
  currentMax?: number;
  selectedOptions?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onRangeChange?: (min: number, max: number) => void;
}

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
  const [showAll, setShowAll] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  
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
  
  // Limit number of visible options when collapsed
  const visibleOptions = showAll ? options : options.slice(0, 5);
  
  // Toggle expansion
  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);
  
  // Handle checkbox/radio change with debounce to prevent multiple API calls
  const handleSelectionChange = useCallback((optionId: string) => {
    setIsBatchUpdating(true);
    let newSelected: string[];
    
    if (type === 'radio') {
      newSelected = [optionId];
    } else {
      if (selected.includes(optionId)) {
        newSelected = selected.filter(id => id !== optionId);
      } else {
        newSelected = [...selected, optionId];
      }
    }
    
    setSelected(newSelected);
    
    // Use setTimeout to batch multiple selections before triggering the callback
    setTimeout(() => {
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
      setIsBatchUpdating(false);
    }, 0);
  }, [selected, type, onSelectionChange]);
  
  // Memoize the range change handler
  const handleRangeChange = useCallback((value: number, isMin: boolean) => {
    if (isMin) {
      setMinValue(value);
      if (onRangeChange) {
        onRangeChange(value, maxValue);
      }
    } else {
      setMaxValue(value);
      if (onRangeChange) {
        onRangeChange(minValue, value);
      }
    }
  }, [maxValue, minValue, onRangeChange]);
  
  // Memoize the show more/less handler
  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);
  
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
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{minValue} {rangeUnit}</span>
                <span>{maxValue} {rangeUnit}</span>
              </div>
              
              <input
                type="range"
                min={rangeMin}
                max={rangeMax}
                value={minValue}
                onChange={(e) => handleRangeChange(parseInt(e.target.value), true)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <input
                type="range"
                min={rangeMin}
                max={rangeMax}
                value={maxValue}
                onChange={(e) => handleRangeChange(parseInt(e.target.value), false)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ) : (
            <>
              {visibleOptions.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type={type}
                    id={`filter-${title}-${option.id}`}
                    name={`filter-${title}`}
                    value={option.id}
                    checked={selected.includes(option.id)}
                    onChange={() => handleSelectionChange(option.id)}
                    className="filter-checkbox"
                  />
                  <label 
                    htmlFor={`filter-${title}-${option.id}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {option.name} {option.count !== undefined && (
                      <span className="text-gray-500">({option.count})</span>
                    )}
                  </label>
                </div>
              ))}
              
              {options.length > 5 && (
                <button
                  className="text-xs text-brand hover:underline mt-1"
                  onClick={toggleShowAll}
                >
                  {showAll ? 'Show Less' : 'Show More'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Memorize the component to prevent unnecessary rerenders
export default memo(FilterCategory);
