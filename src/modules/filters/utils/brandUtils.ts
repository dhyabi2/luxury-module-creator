
import { CategoryBrands } from '@/types/api';

/**
 * Get combined brands from multiple categories
 */
export function getCombinedBrands(categoryBrands: CategoryBrands | undefined, categories: string[]): any[] {
  if (!categoryBrands || !categories || categories.length === 0) {
    return [];
  }
  
  const uniqueBrands = new Map<string, any>();
  
  categories.forEach(categoryId => {
    const brandsForCategory = categoryBrands[categoryId] || [];
    console.log(`Category ${categoryId} has ${brandsForCategory.length} brands`);
    
    brandsForCategory.forEach((brand: any) => {
      if (!uniqueBrands.has(brand.id)) {
        uniqueBrands.set(brand.id, { ...brand });
      } else {
        // If brand already exists, update the count
        const existingBrand = uniqueBrands.get(brand.id)!;
        uniqueBrands.set(brand.id, {
          ...existingBrand,
          count: (existingBrand.count || 0) + (brand.count || 0)
        });
      }
    });
  });
  
  return Array.from(uniqueBrands.values());
}

/**
 * Get formatted category name for display
 */
export function getActiveCategoryName(selectedCategories: string[]): string {
  if (selectedCategories.length === 0) {
    return 'Shop by Brand';
  } else if (selectedCategories.length === 1) {
    const category = selectedCategories[0];
    return `${category.charAt(0).toUpperCase() + category.slice(1)} Brands`;
  } else {
    return 'Brands';
  }
}
