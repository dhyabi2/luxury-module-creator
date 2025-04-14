
import React from 'react';
import FilterCategory from '../FilterCategory';
import { FiltersData } from '@/lib/db/filters/types';

interface WatchSpecificFiltersProps {
  filtersData: FiltersData;
  selectedOptions: { [key: string]: string[] };
  caseSizeRange: { min: number; max: number };
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
  // Ensure we have default filters if data is missing
  const defaultGenders = [
    { id: 'men', name: 'Men', count: 0 },
    { id: 'women', name: 'Women', count: 0 },
    { id: 'unisex', name: 'Unisex', count: 0 }
  ];
  
  // Use fallback values for missing data
  const genderOptions = (filtersData?.genders && filtersData.genders.length > 0) 
    ? filtersData.genders 
    : defaultGenders;
  
  const caseSizeMin = filtersData?.caseSizeRange?.min || 28;
  const caseSizeMax = filtersData?.caseSizeRange?.max || 46;
  const caseSizeUnit = filtersData?.caseSizeRange?.unit || 'mm';
  
  return (
    <>
      <FilterCategory
        title="Case Size"
        options={[]}
        type="range"
        rangeMin={caseSizeMin}
        rangeMax={caseSizeMax}
        rangeUnit={caseSizeUnit}
        currentMin={caseSizeRange.min}
        currentMax={caseSizeRange.max}
        onRangeChange={onCaseSizeRangeChange}
      />
      
      <FilterCategory
        title="Band Material"
        options={filtersData.bands || []}
        type="checkbox"
        selectedOptions={selectedOptions.bands || []}
        onSelectionChange={(selected) => onSelectionChange('bands', selected)}
      />
      
      <FilterCategory
        title="Case Material"
        options={filtersData.caseColors || []}
        type="checkbox"
        selectedOptions={selectedOptions.caseColors || []}
        onSelectionChange={(selected) => onSelectionChange('caseColors', selected)}
      />
      
      <FilterCategory
        title="Dial/Strap Color"
        options={filtersData.colors || []}
        type="checkbox"
        selectedOptions={selectedOptions.colors || []}
        onSelectionChange={(selected) => onSelectionChange('colors', selected)}
      />
    </>
  );
};

export default WatchSpecificFilters;
