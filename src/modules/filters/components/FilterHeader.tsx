
import React from 'react';

interface FilterHeaderProps {
  onClearFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ onClearFilters }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-medium text-gray-900">Filters</h2>
      <button 
        className="text-sm text-brand hover:underline"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterHeader;
