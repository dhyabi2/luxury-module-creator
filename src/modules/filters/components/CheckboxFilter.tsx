
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface CheckboxFilterProps {
  options: FilterOption[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  options,
  selectedOptions,
  onSelectionChange
}) => {
  // Sort options by count (descending) then alphabetically
  const sortedOptions = [...options].sort((a, b) => {
    // First by count (descending)
    if ((b.count || 0) !== (a.count || 0)) {
      return (b.count || 0) - (a.count || 0);
    }
    // Then alphabetically
    return a.name.localeCompare(b.name);
  });
  
  const handleCheckboxChange = (id: string) => {
    let newSelected: string[];
    
    if (selectedOptions.includes(id)) {
      // Remove from selection
      newSelected = selectedOptions.filter(item => item !== id);
    } else {
      // Add to selection
      newSelected = [...selectedOptions, id];
    }
    
    onSelectionChange(newSelected);
  };

  if (options.length === 0) {
    return <div className="text-sm text-gray-500 italic">No options available</div>;
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {sortedOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={`filter-option-${option.id}`}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={() => handleCheckboxChange(option.id)}
          />
          <label 
            htmlFor={`filter-option-${option.id}`}
            className="text-sm text-gray-700 flex-1 cursor-pointer"
          >
            {option.name}
            {option.count !== undefined && (
              <span className="text-gray-400 ml-1">({option.count})</span>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxFilter;
