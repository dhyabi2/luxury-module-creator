
import { FilterOption, ProductType } from "../types";

/**
 * Extract unique categories from products
 */
export function extractCategories(products: ProductType[]): FilterOption[] {
  const categories = new Map<string, { name: string; count: number }>();
  
  products.forEach(product => {
    const categoryId = product.category.toLowerCase().replace(/\s+/g, '-');
    const name = product.category;
    
    if (categories.has(categoryId)) {
      categories.get(categoryId)!.count++;
    } else {
      categories.set(categoryId, { name, count: 1 });
    }
  });
  
  return Array.from(categories.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}

/**
 * Extract unique brands from products
 */
export function extractBrands(products: ProductType[]): FilterOption[] {
  const brands = new Map<string, { name: string; count: number }>();
  
  products.forEach(product => {
    const brandId = product.brand.toLowerCase().replace(/\s+/g, '-');
    const name = product.brand;
    
    if (brands.has(brandId)) {
      brands.get(brandId)!.count++;
    } else {
      brands.set(brandId, { name, count: 1 });
    }
  });
  
  return Array.from(brands.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}

/**
 * Group brands by category
 */
export function groupBrandsByCategory(
  products: ProductType[],
  allBrands: FilterOption[]
): Record<string, FilterOption[]> {
  const result: Record<string, FilterOption[]> = {};
  
  // Create a map for faster lookups
  const brandMap = new Map<string, FilterOption>();
  allBrands.forEach(brand => {
    brandMap.set(brand.id, brand);
  });
  
  // Group products by category
  const productsByCategory = new Map<string, Set<string>>();
  
  products.forEach(product => {
    const categoryId = product.category.toLowerCase().replace(/\s+/g, '-');
    const brandId = product.brand.toLowerCase().replace(/\s+/g, '-');
    
    if (!productsByCategory.has(categoryId)) {
      productsByCategory.set(categoryId, new Set<string>());
    }
    
    productsByCategory.get(categoryId)!.add(brandId);
  });
  
  // Convert sets to arrays and map to brand objects
  productsByCategory.forEach((brandIds, categoryId) => {
    result[categoryId] = Array.from(brandIds)
      .map(id => brandMap.get(id))
      .filter((brand): brand is FilterOption => brand !== undefined);
  });
  
  return result;
}
