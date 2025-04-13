
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
  showAllOption?: boolean;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  options,
  selectedOptions,
  onSelectionChange,
  showAllOption = false
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
    
    // Special handling for "All" option
    if (id === "all") {
      if (selectedOptions.includes("all")) {
        // If "All" is already selected, unselect everything
        newSelected = [];
      } else {
        // If selecting "All", clear other selections
        newSelected = ["all"];
      }
    } else {
      // Remove "all" option if any specific option is selected
      const withoutAll = selectedOptions.filter(item => item !== "all");
      
      if (selectedOptions.includes(id)) {
        // Remove from selection
        newSelected = withoutAll.filter(item => item !== id);
      } else {
        // Add to selection
        newSelected = [...withoutAll, id];
      }
    }
    
    onSelectionChange(newSelected);
  };

  if (options.length === 0) {
    return <div className="text-sm text-gray-500 italic">No options available</div>;
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {showAllOption && (
        <div key="all" className="flex items-center space-x-2">
          <Checkbox
            id={`filter-option-all`}
            checked={selectedOptions.includes("all")}
            onCheckedChange={() => handleCheckboxChange("all")}
          />
          <label 
            htmlFor={`filter-option-all`}
            className="text-sm text-gray-700 flex-1 cursor-pointer font-medium"
          >
            All
          </label>
        </div>
      )}
      
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
