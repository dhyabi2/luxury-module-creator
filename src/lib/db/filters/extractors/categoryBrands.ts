
import { FilterOption, CategoryBrands } from "@/types/api";
import { ProductType } from "../types";

/**
 * Extract unique categories from products with counts
 */
export function extractCategories(products: ProductType[]): FilterOption[] {
  return products.reduce((acc, product) => {
    // Skip if category is already in the accumulator
    if (acc.some(cat => cat.id === product.category.toLowerCase())) {
      return acc;
    }
    
    // Count products in this category
    const count = products.filter(p => 
      p.category.toLowerCase() === product.category.toLowerCase()
    ).length;
    
    // Add category with count
    acc.push({
      id: product.category.toLowerCase(),
      name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      count
    });
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Extract unique brands from products with counts
 */
export function extractBrands(products: ProductType[]): FilterOption[] {
  return products.reduce((acc, product) => {
    // Skip if brand is already in the accumulator
    if (acc.some(brand => brand.id === product.brand)) {
      return acc;
    }
    
    // Count products with this brand
    const count = products.filter(p => p.brand === product.brand).length;
    
    // Add brand with count
    acc.push({
      id: product.brand,
      name: product.brand.charAt(0).toUpperCase() + product.brand.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      count
    });
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Group brands by category
 */
export function groupBrandsByCategory(products: ProductType[], allBrands: FilterOption[]): CategoryBrands {
  const categoryBrands = products.reduce((acc, product) => {
    const category = product.category.toLowerCase();
    const brand = {
      id: product.brand,
      name: product.brand.charAt(0).toUpperCase() + product.brand.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      count: products.filter(p => p.brand === product.brand && p.category.toLowerCase() === category).length
    };
    
    // Initialize category array if it doesn't exist
    if (!acc[category]) {
      acc[category] = [];
    }
    
    // Add brand to category if not already present
    if (!acc[category].some(b => b.id === brand.id)) {
      acc[category].push(brand);
    }
    
    return acc;
  }, {} as CategoryBrands);

  // Ensure each category has at least one brand
  const categories = [...new Set(products.map(p => p.category.toLowerCase()))];
  categories.forEach(category => {
    const categoryId = category.toLowerCase();
    if (!categoryBrands[categoryId] || categoryBrands[categoryId].length === 0) {
      console.log(`[DB:filters:generator] Adding default brands to category: ${categoryId}`);
      // Add some default brands if none exist for this category
      categoryBrands[categoryId] = allBrands.slice(0, 3).map(brand => ({
        ...brand,
        count: 1
      }));
    }
  });
  
  // Ensure all our categories have valid entries in categoryBrands
  const requiredCategories = ['watches', 'accessories', 'bags', 'perfumes'];
  requiredCategories.forEach(category => {
    if (!categoryBrands[category]) {
      console.log(`[DB:filters:generator] Creating missing category brands for: ${category}`);
      categoryBrands[category] = allBrands.slice(0, 3).map(brand => ({
        ...brand,
        count: 1
      }));
    }
  });
  
  return categoryBrands;
}
