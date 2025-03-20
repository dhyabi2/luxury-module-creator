
import { ProductsResponse, Product, FiltersResponse, FilterOption } from '@/types/api';

interface ProductQueryParams {
  gender?: string;
  brand?: string;
  category?: string;
  isNewIn?: boolean;
  isOnSale?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  minCaseSize?: number;
  maxCaseSize?: number;
  band?: string;
  caseColor?: string;
  color?: string;
}

// Caching mechanism for API responses
const responseCache = new Map();
const CACHE_TTL = 60000; // 1 minute cache TTL

// Helper function to check if a cached response is still valid
const isCacheValid = (timestamp: number) => {
  return (Date.now() - timestamp) < CACHE_TTL;
};

export const fetchProducts = async (params: ProductQueryParams): Promise<ProductsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.gender) queryParams.append('gender', params.gender);
  if (params.brand) queryParams.append('brand', params.brand);
  if (params.category) queryParams.append('category', params.category);
  if (params.isNewIn) queryParams.append('isNewIn', 'true');
  if (params.isOnSale) queryParams.append('isOnSale', 'true');
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.minCaseSize !== undefined) queryParams.append('minCaseSize', params.minCaseSize.toString());
  if (params.maxCaseSize !== undefined) queryParams.append('maxCaseSize', params.maxCaseSize.toString());
  if (params.band) queryParams.append('band', params.band);
  if (params.caseColor) queryParams.append('caseColor', params.caseColor);
  if (params.color) queryParams.append('color', params.color);
  
  const queryString = queryParams.toString();
  const cacheKey = `products_${queryString}`;
  
  // Check cache first
  const cachedData = responseCache.get(cacheKey);
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    console.log('Using cached product data for:', queryString);
    return cachedData.data;
  }
  
  const response = await fetch(`/api/products?${queryString}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  responseCache.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const cacheKey = `product_${productId}`;
  
  // Check cache first
  const cachedData = responseCache.get(cacheKey);
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    console.log('Using cached product data for ID:', productId);
    return cachedData.data;
  }
  
  const response = await fetch(`/api/products/${productId}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching product: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  responseCache.set(cacheKey, {
    timestamp: Date.now(),
    data: data.product
  });
  
  return data.product;
};

export const fetchFilters = async (): Promise<FiltersResponse> => {
  const cacheKey = 'filters';
  
  // Check cache first
  const cachedData = responseCache.get(cacheKey);
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    console.log('Using cached filters data');
    return cachedData.data;
  }
  
  const response = await fetch('/api/filters');
  
  if (!response.ok) {
    throw new Error(`Error fetching filters: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  responseCache.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

export const fetchNavigation = async () => {
  const cacheKey = 'navigation';
  
  // Check cache first
  const cachedData = responseCache.get(cacheKey);
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    console.log('Using cached navigation data');
    return cachedData.data;
  }
  
  const response = await fetch('/api/navigation');
  
  if (!response.ok) {
    throw new Error(`Error fetching navigation: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  responseCache.set(cacheKey, {
    timestamp: Date.now(),
    data
  });
  
  return data;
};

// For backward compatibility with existing code
export const fetchFiltersData = fetchFilters;
export const fetchNavigationData = fetchNavigation;
export const fetchProductDetail = fetchProductById;

// Utility function to combine brands from multiple categories
export const getCombinedBrands = (
  categoryBrands: Record<string, FilterOption[]>,
  selectedCategories: string[]
): FilterOption[] => {
  // Create a map to store unique brands by ID
  const uniqueBrands = new Map<string, FilterOption>();
  
  // Iterate through selected categories
  selectedCategories.forEach(categoryId => {
    // Get brands for this category
    const brandsForCategory = categoryBrands[categoryId] || [];
    
    // Add each brand to our map (this automatically deduplicates by ID)
    brandsForCategory.forEach(brand => {
      uniqueBrands.set(brand.id, brand);
    });
  });
  
  // Convert map back to array and return
  return Array.from(uniqueBrands.values());
};

// Helper function to clear the cache
export const clearApiCache = () => {
  responseCache.clear();
  console.log('API cache cleared');
};
