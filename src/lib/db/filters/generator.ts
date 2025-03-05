
import { supabase } from "@/integrations/supabase/client";
import { FiltersData, ProductType, SpecificationsType } from "./types";
import { FilterOption, CategoryBrands } from "@/types/api";
import { defaultFilters } from "./defaultValues";

/**
 * Generates filter data by analyzing product data from the database
 */
export async function generateFilters(): Promise<FiltersData> {
  console.log('[DB:filters:generator] Generating filters from products data');
  
  try {
    // Get all products to build filter data
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('[DB:filters:generator] Error fetching products for filter generation:', error);
      throw error;
    }
    
    // Type safety for products
    const typedProducts = products as unknown as ProductType[];
    
    // Extract and count unique categories
    const categories = extractCategories(typedProducts);
    
    // Extract and count unique brands
    const brands = extractBrands(typedProducts);
    
    // Group brands by category for category-specific brand filtering
    const categoryBrands = groupBrandsByCategory(typedProducts, brands);

    // Get watch products to extract watch-specific filters
    const watches = typedProducts.filter(product => 
      product.category.toLowerCase() === 'watches'
    );
    
    // Extract watch-specific filters
    const bands = extractBands(watches);
    const caseColors = extractCaseColors(watches);
    const colors = extractColors(watches);
    
    // Find min and max prices
    const prices = typedProducts.map(product => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    
    // Find min and max case sizes
    const { minCaseSize, maxCaseSize } = extractCaseSizeRange(watches);
    
    // Construct the complete filters object
    const filtersData: FiltersData = {
      priceRange: {
        min: minPrice,
        max: maxPrice,
        unit: 'OMR'
      },
      categories,
      brands,
      categoryBrands,
      bands,
      caseColors,
      colors,
      caseSizeRange: {
        min: minCaseSize,
        max: maxCaseSize,
        unit: 'mm'
      }
    };
    
    console.log('[DB:filters:generator] Generated filters data:', {
      categoriesCount: categories.length,
      brandsCount: brands.length,
      categoryBrandsCount: Object.keys(categoryBrands).length,
      categoryBrandsDetails: Object.keys(categoryBrands).map(key => 
        `${key}: ${categoryBrands[key].length} brands`
      ),
      bandsCount: bands.length,
      caseColorsCount: caseColors.length,
      colorsCount: colors.length,
      priceRange: `${minPrice}-${maxPrice}`,
      caseSizeRange: `${minCaseSize}-${maxCaseSize}`
    });
    
    return filtersData;
  } catch (error) {
    console.error('[DB:filters:generator] Error generating filters:', error);
    
    // Return minimal default filters as fallback
    return defaultFilters;
  }
}

/**
 * Extract unique categories from products with counts
 */
function extractCategories(products: ProductType[]): FilterOption[] {
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
function extractBrands(products: ProductType[]): FilterOption[] {
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
function groupBrandsByCategory(products: ProductType[], allBrands: FilterOption[]): CategoryBrands {
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

/**
 * Extract bands (strap materials) from watches
 */
function extractBands(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
    if (!watch.specifications) {
      return acc;
    }
    
    const specifications = watch.specifications as SpecificationsType;
    const material = specifications.strapMaterial;
    
    if (!material) {
      return acc;
    }
    
    // Skip if material is already in the accumulator
    if (acc.some(band => band.id === material.toLowerCase())) {
      return acc;
    }
    
    // Count watches with this material
    const count = watches.filter(w => {
      if (!w.specifications) return false;
      const specs = w.specifications as SpecificationsType;
      return specs.strapMaterial && 
             specs.strapMaterial.toLowerCase() === material.toLowerCase();
    }).length;
    
    // Add material with count
    acc.push({
      id: material.toLowerCase(),
      name: material.charAt(0).toUpperCase() + material.slice(1),
      count
    });
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Extract case colors (case materials) from watches
 */
function extractCaseColors(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
    if (!watch.specifications) {
      return acc;
    }
    
    const specifications = watch.specifications as SpecificationsType;
    const material = specifications.caseMaterial;
    
    if (!material) {
      return acc;
    }
    
    // Skip if material is already in the accumulator
    if (acc.some(color => color.id === material.toLowerCase())) {
      return acc;
    }
    
    // Count watches with this material
    const count = watches.filter(w => {
      if (!w.specifications) return false;
      const specs = w.specifications as SpecificationsType;
      return specs.caseMaterial && 
             specs.caseMaterial.toLowerCase() === material.toLowerCase();
    }).length;
    
    // Add material with count
    acc.push({
      id: material.toLowerCase(),
      name: material.charAt(0).toUpperCase() + material.slice(1),
      count
    });
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Extract colors from watches (combining dial and strap colors)
 */
function extractColors(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
    if (!watch.specifications) {
      return acc;
    }
    
    const specifications = watch.specifications as SpecificationsType;
    
    // Process both dial and strap colors
    if (specifications.dialColor) {
      acc = processColor(specifications.dialColor, watches, acc);
    }
    
    if (specifications.strapColor) {
      acc = processColor(specifications.strapColor, watches, acc);
    }
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Process a color and add it to the accumulator if it's not already there
 */
function processColor(color: string, watches: ProductType[], acc: FilterOption[]): FilterOption[] {
  if (!color) return acc;
  
  // Skip if color is already in the accumulator
  if (acc.some(c => c.id === color.toLowerCase())) {
    return acc;
  }
  
  // Count watches with this color (in either dial or strap)
  const count = watches.filter(w => {
    if (!w.specifications) return false;
    const specs = w.specifications as SpecificationsType;
    return (specs.dialColor && specs.dialColor.toLowerCase() === color.toLowerCase()) ||
           (specs.strapColor && specs.strapColor.toLowerCase() === color.toLowerCase());
  }).length;
  
  // Add color with count
  acc.push({
    id: color.toLowerCase(),
    name: color.charAt(0).toUpperCase() + color.slice(1),
    count
  });
  
  return acc;
}

/**
 * Extract case size range from watches
 */
function extractCaseSizeRange(watches: ProductType[]): { minCaseSize: number, maxCaseSize: number } {
  const caseSizes = watches
    .filter(watch => {
      if (!watch.specifications) return false;
      const specs = watch.specifications as SpecificationsType;
      return !!specs.caseSize;
    })
    .map(watch => {
      const specs = watch.specifications as SpecificationsType;
      const sizeStr = specs.caseSize;
      return sizeStr ? parseInt(sizeStr, 10) : NaN;
    })
    .filter(size => !isNaN(size));
  
  const minCaseSize = caseSizes.length > 0 ? Math.min(...caseSizes) : 20;
  const maxCaseSize = caseSizes.length > 0 ? Math.max(...caseSizes) : 45;
  
  return { minCaseSize, maxCaseSize };
}
