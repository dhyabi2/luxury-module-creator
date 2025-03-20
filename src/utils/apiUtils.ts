
// Helper function for making API calls
const callApi = async (endpoint: string, params?: Record<string, any>): Promise<any> => {
  // Supabase URL and API key
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
  
  let url = `${SUPABASE_URL}/functions/${endpoint}`;
  
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
  
  const response = await fetch(url, {
    headers: {
      "apikey": SUPABASE_KEY
    }
  });
  
  if (!response.ok) {
    console.error(`API call failed with status: ${response.status}`);
    throw new Error(`API call failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// API functions for direct calls to edge functions
export const fetchProducts = async (params: Record<string, any> = {}): Promise<any> => {
  console.log("Fetching products with params:", params);
  return callApi('products', params);
};

export const fetchProductById = async (productId: string): Promise<any> => {
  console.log("Fetching product with ID:", productId);
  return callApi(`product-detail/${productId}`);
};

export const fetchFilters = async (): Promise<any> => {
  console.log("Fetching filters");
  return callApi('filters');
};

export const fetchNavigation = async () => {
  console.log("Fetching navigation");
  return callApi('navigation');
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
