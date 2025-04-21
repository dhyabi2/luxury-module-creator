
import React from 'react';
import FilterCategory from '../FilterCategory';
import { FiltersData } from '@/lib/db/filters/types';

interface WatchSpecificFiltersProps {
  filtersData: FiltersData;
  selectedOptions: { [key: string]: string[] };
  onSelectionChange: (category: string, selected: string[]) => void;
}

const WatchSpecificFilters: React.FC<WatchSpecificFiltersProps> = ({
  filtersData,
  selectedOptions,
  onSelectionChange
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
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <FilterCategory
        title="Gender"
        options={genderOptions || []}
        type="checkbox"
        selectedOptions={selectedOptions.genders || []}
        onSelectionChange={(selected) => onSelectionChange('genders', selected)}
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
    </div>
  );
};

export default WatchSpecificFilters;
