
import { useState, useEffect } from 'react';
import { FiltersResponse } from '@/types/api';
import { getCombinedBrands, getActiveCategoryName } from '../utils/brandUtils';

interface FilterState {
  selectedOptions: Record<string, any>;
  priceRange: { min: number; max: number };
  caseSizeRange: { min: number; max: number };
  categorySpecificBrands: any[];
  activeCategoryName: string;
}

interface UseFilterStateProps {
  initialFilters: Record<string, any>;
  filtersData: FiltersResponse | null;
  categoryParam?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function useFilterState({ 
  initialFilters, 
  filtersData, 
  categoryParam,
  onFilterChange 
}: UseFilterStateProps): FilterState & {
  handleSelectionChange: (category: string, selected: string[]) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
  handleCaseSizeRangeChange: (min: number, max: number) => void;
  handleClearFilters: () => void;
} {
  // State management
  const [selectedOptions, setSelectedOptions] = useState(initialFilters);
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.priceRange?.min || 0,
    max: initialFilters.priceRange?.max || 1225
  });
  const [caseSizeRange, setCaseSizeRange] = useState({
    min: initialFilters.caseSizeRange?.min || 20,
    max: initialFilters.caseSizeRange?.max || 45
  });
  
  // Initialize ranges when filter data is loaded
  useEffect(() => {
    if (filtersData) {
      if (!initialFilters.priceRange && filtersData.priceRange) {
        setPriceRange({
          min: filtersData.priceRange.min,
          max: filtersData.priceRange.max
        });
      }
      
      if (!initialFilters.caseSizeRange && filtersData.caseSizeRange) {
        setCaseSizeRange({
          min: filtersData.caseSizeRange.min,
          max: filtersData.caseSizeRange.max
        });
      }
      
      // If there's a category parameter, add it to the selected categories
      if (categoryParam && 
          selectedOptions.categories && 
          !selectedOptions.categories.includes(categoryParam)) {
        setSelectedOptions(prev => ({
          ...prev,
          categories: [...(prev.categories || []), categoryParam]
        }));
      }
    }
  }, [filtersData, initialFilters, categoryParam]);
  
  // Calculate derived values
  const selectedCategories = selectedOptions.categories || [];
  
  // Get category-specific brands
  const getCategorySpecificBrands = () => {
    if (!filtersData || !filtersData.categoryBrands) {
      return filtersData?.brands || [];
    }
    
    if (selectedCategories.length === 0) {
      return filtersData.brands || [];
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      const result = filtersData.categoryBrands[categoryId] || [];
      console.log(`Getting brands for single category ${categoryId}:`, result.length);
      return result;
    } else {
      const result = getCombinedBrands(filtersData.categoryBrands, selectedCategories);
      console.log(`Getting combined brands for ${selectedCategories.length} categories:`, result.length);
      return result;
    }
  };
  
  const categorySpecificBrands = getCategorySpecificBrands();
  const activeCategoryName = getActiveCategoryName(selectedCategories);
  
  // Apply filters when state changes
  useEffect(() => {
    if (onFilterChange) {
      const filters = {
        ...selectedOptions,
        priceRange,
        caseSizeRange
      };
      console.log('Applying filters:', filters);
      onFilterChange(filters);
    }
  }, [selectedOptions, priceRange, caseSizeRange, onFilterChange]);
  
  // Debug brands information
  useEffect(() => {
    if (filtersData) {
      console.log('All brands count:', filtersData.brands?.length || 0);
      console.log('Category brands:', Object.keys(filtersData.categoryBrands || {}).length);
      console.log('Selected categories:', selectedCategories);
      console.log('Available brands for current selection:', categorySpecificBrands.length);
    }
  }, [filtersData, selectedCategories, categorySpecificBrands]);
  
  // Handle selection change
  const handleSelectionChange = (category: string, selected: string[]) => {
    if (!category) {
      console.warn('Category name is required');
      return;
    }
    
    console.log(`Selection change for ${category}:`, selected);
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected || []
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  // Handle case size range change
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    setCaseSizeRange({ min, max });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedOptions({});
    
    if (filtersData) {
      if (filtersData.priceRange) {
        setPriceRange({
          min: filtersData.priceRange.min,
          max: filtersData.priceRange.max
        });
      }
      
      if (filtersData.caseSizeRange) {
        setCaseSizeRange({
          min: filtersData.caseSizeRange.min,
          max: filtersData.caseSizeRange.max
        });
      }
    }
  };
  
  return {
    selectedOptions,
    priceRange,
    caseSizeRange,
    categorySpecificBrands,
    activeCategoryName,
    handleSelectionChange,
    handlePriceRangeChange,
    handleCaseSizeRangeChange,
    handleClearFilters
  };
}
