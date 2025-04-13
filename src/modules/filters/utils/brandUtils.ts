/**
 * Helper functions for brand filtering
 */

/**
 * Get combined brands from multiple categories
 */
export const getCombinedBrands = (
  categoryBrands: Record<string, any[]>,
  selectedCategories: string[]
) => {
  const uniqueBrands = new Map();
  
  // If we have an "all" option or empty selection, return all brands from all categories
  if (selectedCategories.includes("all") || selectedCategories.length === 0) {
    // Combine all brands from all categories
    Object.values(categoryBrands).forEach(brandsArray => {
      brandsArray.forEach(brand => {
        uniqueBrands.set(brand.id, brand);
      });
    });
  } else {
    // Otherwise, get brands only for selected categories
    selectedCategories.forEach(categoryId => {
      const brandsForCategory = categoryBrands[categoryId] || [];
      
      brandsForCategory.forEach(brand => {
        uniqueBrands.set(brand.id, brand);
      });
    });
  }
  
  return Array.from(uniqueBrands.values());
};

/**
 * Get active category name for display
 */
export const getActiveCategoryName = (selectedCategories: string[]) => {
  if (selectedCategories.includes("all") || selectedCategories.length === 0) {
    return "Shop by Brand";
  }
  
  if (selectedCategories.length === 1) {
    // Note: We can't show the actual name here since we don't have the category data
    // This will be replaced when filtersData is loaded in the component
    return `${selectedCategories[0]} Brands`;
  }
  
  return "Shop by Brand";
};
