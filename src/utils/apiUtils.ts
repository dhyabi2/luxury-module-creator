
// Helper function for making API calls
const callApi = async (endpoint: string, params?: Record<string, any>): Promise<any> => {
  let url = `${window.location.origin}/${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  console.log(`Calling API: ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error(`API call failed with status: ${response.status}`);
    throw new Error(`API call failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// API functions for direct calls
export const fetchProducts = async (params: Record<string, any> = {}): Promise<any> => {
  console.log("Fetching products with params:", params);
  return callApi('api/products', params);
};

export const fetchProductById = async (productId: string): Promise<any> => {
  console.log("Fetching product with ID:", productId);
  return callApi(`api/product-detail/${productId}`);
};

export const fetchFilters = async (): Promise<any> => {
  console.log("Fetching filters");
  return callApi('api/filters');
};

export const fetchNavigation = async () => {
  console.log("Fetching navigation");
  return callApi('api/navigation');
};

// Backward compatibility aliases
export const fetchFiltersData = fetchFilters;
export const fetchNavigationData = fetchNavigation;
export const fetchProductDetail = fetchProductById;

// Utility function to combine brands from multiple categories
export const getCombinedBrands = (
  categoryBrands: Record<string, any[]>,
  selectedCategories: string[]
): any[] => {
  const uniqueBrands = new Map<string, any>();
  
  selectedCategories.forEach(categoryId => {
    const brandsForCategory = categoryBrands[categoryId] || [];
    
    brandsForCategory.forEach(brand => {
      uniqueBrands.set(brand.id, brand);
    });
  });
  
  return Array.from(uniqueBrands.values());
};
