
import React from 'react';
import FilterHeader from './components/FilterHeader';
import { FilterCategories } from './components/FilterCategories';
import FilterSidebarContent from './components/FilterSidebarContent';
import { useFilterSidebarState } from './hooks/useFilterSidebarState';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  categoryParam?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange,
  initialFilters = {},
  categoryParam
}) => {
  const {
    filtersData,
    isLoading,
    selectedOptions,
    priceRange,
    handleClearFilters,
    setSelectedOptions,
    setPriceRange,
  } = useFilterSidebarState({
    onFilterChange,
    initialFilters,
    categoryParam
  });
  
  // Handle selection change
  const handleSelectionChange = (category: string, values: string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: values
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  // Handle clearing filters with toast notification
  const handleClearFiltersWithNotification = () => {
    handleClearFilters();
  };

  if (isLoading || !filtersData) {
    return <FilterSidebarContent filtersData={null} isLoading={true} />;
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={handleClearFiltersWithNotification} />
      
      <FilterCategories
        filtersData={filtersData}
        selectedOptions={selectedOptions}
        priceRange={priceRange}
        categorySpecificBrands={filtersData.brands || []}
        activeCategoryName=""
        handleSelectionChange={handleSelectionChange}
        handlePriceRangeChange={handlePriceRangeChange}
      />
    </div>
  );
};

export default FilterSidebar;

