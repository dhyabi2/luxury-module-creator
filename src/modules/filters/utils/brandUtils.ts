
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
  
  selectedCategories.forEach(categoryId => {
    const brandsForCategory = categoryBrands[categoryId] || [];
    
    brandsForCategory.forEach(brand => {
      uniqueBrands.set(brand.id, brand);
    });
  });
  
  return Array.from(uniqueBrands.values());
};

/**
 * Get active category name for display
 */
export const getActiveCategoryName = (selectedCategories: string[]) => {
  if (selectedCategories.length === 0) {
    return "Shop by Brand";
  }
  
  if (selectedCategories.length === 1) {
    // Note: We can't show the actual name here since we don't have the category data
    // This will be replaced when filtersData is loaded in the component
    return `${selectedCategories[0]} Brands`;
  }
  
  return "Shop by Brand";
};
