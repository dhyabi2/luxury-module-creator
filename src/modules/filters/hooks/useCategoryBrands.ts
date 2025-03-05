
import { useMemo } from 'react';
import { FiltersData } from '@/lib/db/filters/types';
import { FilterOption } from '@/types/api';
import { getCombinedBrands } from '@/lib/db/filters/extractors/categoryBrands';

interface UseCategoryBrandsProps {
  selectedCategories: string[];
  filtersData: FiltersData | null;
}

export const useCategoryBrands = ({ selectedCategories, filtersData }: UseCategoryBrandsProps) => {
  // Determine if watch-specific filters should be shown
  const showWatchFilters = useMemo(() => {
    return selectedCategories.includes('watches') && selectedCategories.length === 1;
  }, [selectedCategories]);
  
  // Get brands for the selected category/categories
  const categorySpecificBrands = useMemo(() => {
    if (!filtersData || !filtersData.categoryBrands || selectedCategories.length === 0) {
      return [];
    }
    
    // Check if we have non-watch categories selected
    const hasNonWatchCategories = selectedCategories.some(
      category => category !== 'watches'
    );
    console.log(`[useCategoryBrands] Non-watch categories selected: ${hasNonWatchCategories}`);
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      console.log(`[useCategoryBrands] Single category selected: ${categoryId}, filtering brands`);
      // Make sure to check if the category exists in categoryBrands before returning
      return filtersData.categoryBrands[categoryId] || [];
    } else {
      console.log(`[useCategoryBrands] Multiple categories selected, showing combined brands`);
      // Use the utility function to get combined unique brands
      const combinedBrands = getCombinedBrands(filtersData.categoryBrands, selectedCategories);
      console.log(`[useCategoryBrands] Combined ${combinedBrands.length} brands from ${selectedCategories.length} categories`);
      return combinedBrands;
    }
  }, [filtersData, selectedCategories]);
  
  // Choose an appropriate title for the brands section based on selected categories
  const activeCategoryName = useMemo(() => {
    if (selectedCategories.length === 0) {
      return 'Shop by Brand';
    } else if (selectedCategories.length === 1) {
      const category = selectedCategories[0];
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Brands`;
    } else {
      return 'Brands';
    }
  }, [selectedCategories]);
  
  return {
    showWatchFilters,
    categorySpecificBrands,
    activeCategoryName
  };
};
