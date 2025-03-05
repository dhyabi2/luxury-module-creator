
import React from 'react';
import { toast } from 'sonner';
import FilterCategory from './FilterCategory';
import FilterHeader from './components/FilterHeader';
import FilterLoading from './components/FilterLoading';
import WatchSpecificFilters from './components/WatchSpecificFilters';
import { useFiltersData } from './hooks/useFiltersData';
import { useFilterSelection } from './hooks/useFilterSelection';
import { useCategoryBrands } from './hooks/useCategoryBrands';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  // Fetch filters data
  const { filtersData, isLoading } = useFiltersData();
  
  // Handle filter selection and range changes
  const {
    selectedOptions,
    priceRange,
    caseSizeRange,
    handleSelectionChange,
    handlePriceRangeChange,
    handleCaseSizeRangeChange,
    handleClearFilters
  } = useFilterSelection({ 
    initialFilters, 
    filtersData, 
    onFilterChange 
  });
  
  // Get category-specific brands based on selected categories
  const {
    showWatchFilters,
    categorySpecificBrands,
    activeCategoryName
  } = useCategoryBrands({
    selectedCategories: selectedOptions.categories || [],
    filtersData
  });
  
  // Effect to validate brand selection against available brands
  React.useEffect(() => {
    if (filtersData && categorySpecificBrands.length > 0 && selectedOptions.brands && selectedOptions.brands.length > 0) {
      const validBrandIds = new Set(categorySpecificBrands.map(brand => brand.id));
      const newBrands = selectedOptions.brands.filter(brandId => validBrandIds.has(brandId));
      
      if (newBrands.length !== selectedOptions.brands.length) {
        console.log('[FilterSidebar] Clearing brands not in selected category');
        handleSelectionChange('brands', newBrands);
      }
    }
  }, [categorySpecificBrands, selectedOptions.brands]);

  const onClearFiltersWithToast = () => {
    handleClearFilters();
    toast.success('Filters cleared');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={onClearFiltersWithToast} />
      
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
            options={filtersData.categories}
            type="checkbox"
            selectedOptions={selectedOptions.categories || []}
            onSelectionChange={(selected) => handleSelectionChange('categories', selected)}
          />
          
          <FilterCategory
            title={activeCategoryName}
            options={categorySpecificBrands}
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
    </div>
  );
};

export default FilterSidebar;
