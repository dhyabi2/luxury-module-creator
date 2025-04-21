
import React from 'react';
import FilterCategory from '../FilterCategory';
import { FiltersResponse } from '@/types/api';

interface FilterCategoriesProps {
  filtersData: FiltersResponse;
  selectedOptions: Record<string, string[]>;
  priceRange: { min: number; max: number };
  categorySpecificBrands: any[];
  activeCategoryName: string;
  handleSelectionChange: (filterType: string, values: string[]) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
}

export const FilterCategories: React.FC<FilterCategoriesProps> = ({
  filtersData,
  selectedOptions,
  priceRange,
  categorySpecificBrands,
  handleSelectionChange,
  handlePriceRangeChange
}) => {
  const showWatchFilters = false; // We'll implement this later if needed
  
  return (
    <div className="space-y-1">
      {/* Categories filter */}
      <FilterCategory
        title="Categories"
        type="checkbox"
        options={filtersData.categories || []}
        selectedOptions={selectedOptions.categories || []}
        onSelectionChange={(values) => handleSelectionChange('categories', values)}
        initialExpanded={true}
        showAllOption={true}
      />
      
      {/* Price Range filter */}
      <FilterCategory
        title="Price Range"
        type="range"
        options={[]}
        rangeMin={filtersData.priceRange?.min || 0}
        rangeMax={filtersData.priceRange?.max || 1000}
        rangeUnit={filtersData.priceRange?.unit || 'OMR'}
        currentMin={priceRange?.min || 0}
        currentMax={priceRange?.max || 1000}
        onRangeChange={handlePriceRangeChange}
        initialExpanded={true}
      />
      
      {/* Clearance filter */}
      <FilterCategory
        title="Clearance"
        type="checkbox"
        options={[{ id: 'clearance', name: 'On Clearance' }]}
        selectedOptions={selectedOptions.clearance || []}
        onSelectionChange={(values) => handleSelectionChange('clearance', values)}
        initialExpanded={true}
        showAllOption={false}
      />
      
      {/* In Stock filter */}
      <FilterCategory
        title="Availability"
        type="checkbox"
        options={[{ id: 'instock', name: 'In Stock' }]}
        selectedOptions={selectedOptions.instock || []}
        onSelectionChange={(values) => handleSelectionChange('instock', values)}
        initialExpanded={true}
        showAllOption={false}
      />
      
      {/* Brands filter */}
      <FilterCategory
        title="Brands"
        type="checkbox"
        options={categorySpecificBrands}
        selectedOptions={selectedOptions.brands || []}
        onSelectionChange={(values) => handleSelectionChange('brands', values)}
        initialExpanded={true}
        showAllOption={true}
      />
      
      {/* Gender filter */}
      <FilterCategory
        title="Gender"
        type="checkbox"
        options={filtersData.genders || []}
        selectedOptions={selectedOptions.genders || []}
        onSelectionChange={(values) => handleSelectionChange('genders', values)}
        initialExpanded={true}
        showAllOption={false}
      />
    </div>
  );
};

