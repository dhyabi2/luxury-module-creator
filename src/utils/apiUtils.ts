
/**
 * Utility functions for direct API calls without React hooks
 */

/**
 * Fetch products with given filters, pagination and sorting
 */
export async function fetchProducts(filters: Record<string, any>, page: number, pageSize: number, sortBy: string) {
  // Build query parameters
  const urlParams = new URLSearchParams();
  
  // Add brand filter
  if (filters.brands && filters.brands.length > 0) {
    urlParams.append('brand', filters.brands.join(','));
  } else if (filters.brand) {
    urlParams.append('brand', filters.brand);
  }
  
  // Add category filter
  if (filters.categories && filters.categories.length > 0) {
    urlParams.append('category', filters.categories.join(','));
  }
  
  // Add gender filter
  if (filters.genders && filters.genders.length > 0) {
    urlParams.append('gender', filters.genders.join(','));
  }
  
  // Add band filter
  if (filters.bands && filters.bands.length > 0) {
    urlParams.append('band', filters.bands.join(','));
  }
  
  // Add case color filter
  if (filters.caseColors && filters.caseColors.length > 0) {
    urlParams.append('caseColor', filters.caseColors.join(','));
  }
  
  // Add color filter
  if (filters.colors && filters.colors.length > 0) {
    urlParams.append('color', filters.colors.join(','));
  }
  
  // Add price range filter
  if (filters.priceRange) {
    urlParams.append('minPrice', filters.priceRange.min.toString());
    urlParams.append('maxPrice', filters.priceRange.max.toString());
  }
  
  // Add case size range filter
  if (filters.caseSizeRange) {
    urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
    urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
  }
  
  // Add pagination and sorting
  urlParams.append('page', page.toString());
  urlParams.append('pageSize', pageSize.toString());
  urlParams.append('sortBy', sortBy);
  
  // Fetch products
  const response = await fetch(`/api/products?${urlParams.toString()}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error (${response.status}): ${errorText.substring(0, 150)}...`);
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Fetch product detail by ID
 */
export async function fetchProductDetail(productId: string) {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  const response = await fetch(`/api/products/${productId}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error fetching product (${response.status}): ${errorText.substring(0, 150)}...`);
    throw new Error('Product not found');
  }
  
  return await response.json();
}

/**
 * Fetch filters data
 */
export async function fetchFiltersData() {
  const response = await fetch('/api/filters');
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Server responded with error (${response.status}): ${errorText.substring(0, 150)}...`);
    throw new Error(`Failed to fetch filters: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Create category-specific brand mappings if not present
  if (!data.categoryBrands) {
    data.categoryBrands = {
      'watches': data.brands.filter((brand: any) => 
        ['aigner', 'calvinKlein', 'michaelKors', 'tissot'].includes(brand.id)),
      'accessories': data.brands.filter((brand: any) => 
        ['aigner', 'michaelKors'].includes(brand.id)),
      'bags': data.brands.filter((brand: any) => 
        ['aigner', 'michaelKors'].includes(brand.id)),
      'perfumes': data.brands.filter((brand: any) => 
        ['calvinKlein'].includes(brand.id))
    };
  }
  
  return data;
}

/**
 * Fetch navigation data
 */
export async function fetchNavigationData() {
  const response = await fetch('/api/navigation');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch navigation data: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Helper function to get combined brands from multiple categories
 */
export function getCombinedBrands(categoryBrands: Record<string, any[]>, selectedCategories: string[]) {
  // Create a map of unique brands
  const brandMap = new Map();
  
  selectedCategories.forEach(category => {
    if (categoryBrands[category]) {
      categoryBrands[category].forEach((brand: any) => {
        if (!brandMap.has(brand.id)) {
          brandMap.set(brand.id, brand);
        }
      });
    }
  });
  
  // Convert map back to array
  return Array.from(brandMap.values());
}
