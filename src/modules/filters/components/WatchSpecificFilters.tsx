
import React from 'react';
import FilterCategory from '../FilterCategory';
import { FiltersData } from '@/lib/db/filters/types';

interface WatchSpecificFiltersProps {
  filtersData: FiltersData;
  selectedOptions: { [key: string]: string[] };
  caseSizeRange: { min: number, max: number };
  onSelectionChange: (category: string, selected: string[]) => void;
  onCaseSizeRangeChange: (min: number, max: number) => void;
}

const WatchSpecificFilters: React.FC<WatchSpecificFiltersProps> = ({
  filtersData,
  selectedOptions,
  caseSizeRange,
  onSelectionChange,
  onCaseSizeRangeChange
}) => {
  return (
    <>
      <FilterCategory
        title="Band"
        options={filtersData.bands}
        type="checkbox"
        selectedOptions={selectedOptions.bands || []}
        onSelectionChange={(selected) => onSelectionChange('bands', selected)}
      />
      
      <FilterCategory
        title="Case Colour"
        options={filtersData.caseColors}
        type="checkbox"
        selectedOptions={selectedOptions.caseColors || []}
        onSelectionChange={(selected) => onSelectionChange('caseColors', selected)}
      />
      
      <FilterCategory
        title="Colour"
        options={filtersData.colors}
        type="checkbox"
        selectedOptions={selectedOptions.colors || []}
        onSelectionChange={(selected) => onSelectionChange('colors', selected)}
      />
      
      <FilterCategory
        title="Case Size"
        options={[]}
        type="range"
        rangeMin={filtersData.caseSizeRange.min}
        rangeMax={filtersData.caseSizeRange.max}
        rangeUnit={filtersData.caseSizeRange.unit}
        currentMin={caseSizeRange.min}
        currentMax={caseSizeRange.max}
        onRangeChange={onCaseSizeRangeChange}
      />
    </>
  );
};

export default WatchSpecificFilters;
