
import React from 'react';
import { toast } from 'sonner';
import FilterHeader from './components/FilterHeader';
import FilterSidebarContent from './components/FilterSidebarContent';
import { useFiltersData } from './hooks/useFiltersData';
import { useFilterState } from './hooks/useFilterState';

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
  // Get filters data
  const selectedCategories = initialFilters.categories || 
    (categoryParam ? [categoryParam] : []);
  
  const { filtersData, isLoading } = useFiltersData(selectedCategories, categoryParam);
  
  // Filter state management
  const {
    selectedOptions,
    priceRange,
    caseSizeRange,
    categorySpecificBrands,
    activeCategoryName,
    handleSelectionChange,
    handlePriceRangeChange,
    handleCaseSizeRangeChange,
    handleClearFilters
  } = useFilterState({
    initialFilters,
    filtersData,
    categoryParam,
    onFilterChange
  });
  
  // Handler for clearing filters with toast notification
  const handleClearFiltersWithNotification = () => {
    handleClearFilters();
    toast.success('Filters cleared');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={handleClearFiltersWithNotification} />
      
      <FilterSidebarContent
        filtersData={filtersData}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        priceRange={priceRange}
        caseSizeRange={caseSizeRange}
        handleSelectionChange={handleSelectionChange}
        handlePriceRangeChange={handlePriceRangeChange}
        handleCaseSizeRangeChange={handleCaseSizeRangeChange}
        categorySpecificBrands={categorySpecificBrands}
        activeCategoryName={activeCategoryName}
      />
    </div>
  );
};

export default FilterSidebar;
