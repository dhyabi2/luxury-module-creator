
import { ProductsResponse, Product, FiltersResponse } from '@/types/api';

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
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error);
    throw error;
  }
};

// API functions for direct calls
export const fetchProducts = async (params: Record<string, any> = {}): Promise<ProductsResponse> => {
  console.log("Fetching products with params:", params);
  
  try {
    const data = await callApi('api/products', params);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Fallback to mock data if API call fails
    return {
      products: [],
      pagination: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 8
      }
    };
  }
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  console.log("Fetching product with ID:", productId);
  
  try {
    const data = await callApi(`api/product-detail/${productId}`);
    
    if (!data.product) {
      throw new Error("Product not found");
    }
    
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchFilters = async (): Promise<FiltersResponse> => {
  console.log("Fetching filters");
  
  try {
    const data = await callApi('api/filters');
    return data;
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};

export const fetchNavigation = async () => {
  console.log("Fetching navigation");
  
  try {
    const data = await callApi('api/navigation');
    return data;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    throw error;
  }
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
