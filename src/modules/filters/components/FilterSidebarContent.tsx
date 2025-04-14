
import React from 'react';
import { Loader2 } from 'lucide-react';
import FilterCategory from '../FilterCategory';
import FilterLoading from './FilterLoading';
import WatchSpecificFilters from './WatchSpecificFilters';
import { FiltersResponse } from '@/types/api';

interface FilterSidebarContentProps {
  filtersData: FiltersResponse | null;
  isLoading: boolean;
  selectedOptions: Record<string, string[]>;
  priceRange: { min: number; max: number };
  caseSizeRange: { min: number; max: number };
  handleSelectionChange: (filterType: string, values: string[]) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
  handleCaseSizeRangeChange: (min: number, max: number) => void;
  categorySpecificBrands: Record<string, any[]>;
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
  // If still loading, show skeleton
  if (isLoading) {
    return <FilterLoading />;
  }

  // Check if we have filter data
  if (!filtersData) {
    return (
      <div className="py-8 text-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Loading filters...</p>
      </div>
    );
  }

  // Get all available brands
  const allBrands = filtersData.brands || [];
  console.log('All brands count:', allBrands.length);
  
  // Get category-specific brands if available
  const availableCategoryBrands = Object.keys(categorySpecificBrands).length;
  console.log('Category brands:', availableCategoryBrands);
  
  // Check if we're filtering for specific categories
  const selectedCategories = selectedOptions.categories || [];
  console.log('Selected categories:', selectedCategories);
  
  // Determine which brands to show based on selected categories
  let brandsToShow = allBrands;
  
  if (selectedCategories.length > 0 && availableCategoryBrands > 0) {
    // Create a unique set of brands from all selected categories
    const uniqueBrands = new Map();
    
    selectedCategories.forEach(categoryId => {
      const brandsForCategory = categorySpecificBrands[categoryId] || [];
      
      brandsForCategory.forEach(brand => {
        uniqueBrands.set(brand.id, brand);
      });
    });
    
    brandsToShow = Array.from(uniqueBrands.values());
  }
  
  console.log('Available brands for current selection:', brandsToShow.length);
  
  // Get gender options - ensure they exist with fallback
  const genderOptions = filtersData.genders || [
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'unisex', name: 'Unisex' }
  ];
  
  console.log('Gender options:', genderOptions);
  
  // Check if the active category is watches to show watch-specific filters
  const showWatchFilters = activeCategoryName.toLowerCase() === 'watches' || 
    (selectedCategories.length > 0 && selectedCategories.includes('watches'));

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
        rangeMin={priceRange?.min || 0}
        rangeMax={priceRange?.max || 1000}
        rangeUnit={priceRange?.unit || 'OMR'}
        currentMin={priceRange?.min || 0}
        currentMax={priceRange?.max || 1000}
        onRangeChange={handlePriceRangeChange}
        initialExpanded={true}
      />
      
      {/* Brands filter */}
      <FilterCategory
        title="Brands"
        type="checkbox"
        options={brandsToShow}
        selectedOptions={selectedOptions.brands || []}
        onSelectionChange={(values) => handleSelectionChange('brands', values)}
        initialExpanded={true}
        showAllOption={true}
      />
      
      {/* Gender filter */}
      <FilterCategory
        title="Gender"
        type="checkbox"
        options={genderOptions}
        selectedOptions={selectedOptions.genders || []}
        onSelectionChange={(values) => handleSelectionChange('genders', values)}
        initialExpanded={true}
        showAllOption={false}
      />
      
      {/* Watch-specific filters */}
      {showWatchFilters && (
        <WatchSpecificFilters
          filtersData={filtersData}
          selectedOptions={selectedOptions}
          caseSizeRange={caseSizeRange}
          handleSelectionChange={handleSelectionChange}
          handleCaseSizeRangeChange={handleCaseSizeRangeChange}
        />
      )}
    </div>
  );
};

export default FilterSidebarContent;
