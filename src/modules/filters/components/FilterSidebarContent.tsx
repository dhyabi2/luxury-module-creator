
import React from 'react';
import FilterCategory from '../FilterCategory';
import FilterLoading from './FilterLoading';
import WatchSpecificFilters from './WatchSpecificFilters';
import { FiltersResponse } from '@/types/api';

interface FilterSidebarContentProps {
  filtersData: FiltersResponse | null;
  isLoading: boolean;
  selectedOptions: Record<string, any>;
  priceRange: { min: number; max: number };
  caseSizeRange: { min: number; max: number };
  handleSelectionChange: (category: string, selected: string[]) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
  handleCaseSizeRangeChange: (min: number, max: number) => void;
  categorySpecificBrands: any[];
  activeCategoryName: string;
}

const FilterSidebarContent: React.FC<FilterSidebarContentProps> = ({
  filtersData,
  isLoading,
  selectedOptions,
  priceRange,
  caseSizeRange,
  handleSelectionChange,
  handlePriceRangeChange,
  handleCaseSizeRangeChange,
  categorySpecificBrands,
  activeCategoryName
}) => {
  // Calculate if we should show watch filters
  const selectedCategories = selectedOptions.categories || [];
  const showWatchFilters = selectedCategories.includes('watches') && selectedCategories.length === 1;

  // Debug the brands being passed to the filter
  if (categorySpecificBrands && categorySpecificBrands.length > 0) {
    console.log(`Rendering ${categorySpecificBrands.length} brands in filter`, 
      categorySpecificBrands.slice(0, 3).map(b => b.name));
  } else {
    console.log('No brands available to display in filter');
  }

  return (
    <>
      {isLoading ? (
        <FilterLoading />
      ) : filtersData ? (
        <>
          <FilterCategory
            title="Price Range"
            options={[]}
            type="range"
            rangeMin={filtersData.priceRange.min}
            rangeMax={filtersData.priceRange.max}
            rangeUnit={filtersData.priceRange.unit}
            currentMin={priceRange.min}
            currentMax={priceRange.max}
            onRangeChange={handlePriceRangeChange}
          />
          
          <FilterCategory
            title="Shop by Category"
            options={filtersData.categories || []}
            type="checkbox"
            selectedOptions={selectedOptions.categories || []}
            onSelectionChange={(selected) => handleSelectionChange('categories', selected)}
          />
          
          <FilterCategory
            title={activeCategoryName}
            options={categorySpecificBrands || []}
            type="checkbox"
            selectedOptions={selectedOptions.brands || []}
            onSelectionChange={(selected) => handleSelectionChange('brands', selected)}
          />
          
          {showWatchFilters && (
            <WatchSpecificFilters
              filtersData={filtersData}
              selectedOptions={selectedOptions}
              caseSizeRange={caseSizeRange}
              onSelectionChange={handleSelectionChange}
              onCaseSizeRangeChange={handleCaseSizeRangeChange}
            />
          )}
        </>
      ) : null}
    </>
  );
};

export default FilterSidebarContent;
