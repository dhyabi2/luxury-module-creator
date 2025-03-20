
import React, { useState } from 'react';
import { CheckboxFilterProps, FilterOption } from '../types/filterTypes';

const RadioFilter: React.FC<CheckboxFilterProps> = ({
  options,
  selectedOptions,
  onSelectionChange
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Limit number of visible options when collapsed
  const visibleOptions = showAll ? options : options.slice(0, 5);
  
  // Toggle show more/less
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };
  
  // Handle radio change - only one selection allowed
  const handleSelectionChange = (optionId: string) => {
    onSelectionChange([optionId]);
  };
  
  return (
    <>
      {visibleOptions.map((option: FilterOption) => (
        <div key={option.id} className="flex items-center">
          <input
            type="radio"
            id={`filter-radio-${option.id}`}
            name="filter-radio-group"
            value={option.id}
            checked={selectedOptions.includes(option.id)}
            onChange={() => handleSelectionChange(option.id)}
            className="filter-checkbox"
          />
          <label 
            htmlFor={`filter-radio-${option.id}`}
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
  );
};

export default RadioFilter;
