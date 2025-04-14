
import React from 'react';
import FilterCategory from '../FilterCategory';
import FilterLoading from './FilterLoading';
import WatchSpecificFilters from './WatchSpecificFilters';

interface FilterSidebarContentProps {
  filtersData: any | null;
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
  const showWatchFilters = selectedCategories.includes('watches') && !selectedCategories.includes('all');

  // Debug the brands being passed to the filter
  if (categorySpecificBrands && categorySpecificBrands.length > 0) {
    console.log(`Rendering ${categorySpecificBrands.length} brands in filter`, 
      categorySpecificBrands.slice(0, 3).map(b => b.name));
  } else {
    console.log('No brands available to display in filter');
  }
  
  // Debug the genders data
  console.log('Gender options:', filtersData?.genders);

  return (
    <>
      {isLoading ? (
        <FilterLoading />
      ) : filtersData ? (
        <>
          <FilterCategory
            title="Gender"
            options={filtersData.genders || []}
            type="checkbox"
            selectedOptions={selectedOptions.genders || []}
            onSelectionChange={(selected) => handleSelectionChange('genders', selected)}
            showAllOption={true}
          />
          
          <FilterCategory
            title="Price Range"
            options={[]}
            type="range"
            rangeMin={filtersData.priceRange?.min || 0}
            rangeMax={filtersData.priceRange?.max || 1000}
            rangeUnit={filtersData.priceRange?.unit || ''}
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
            showAllOption={true}
          />
          
          <FilterCategory
            title={activeCategoryName}
            options={categorySpecificBrands || []}
            type="checkbox"
            selectedOptions={selectedOptions.brands || []}
            onSelectionChange={(selected) => handleSelectionChange('brands', selected)}
            showAllOption={true}
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
      ) : (
        <div className="text-gray-500 italic text-center py-4">
          No filter options available
        </div>
      )}
    </>
  );
};

export default FilterSidebarContent;
