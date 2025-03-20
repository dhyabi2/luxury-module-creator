
import { ProductsResponse, Product } from '@/types/api';

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
  
  const response = await fetch(`/api/products?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const response = await fetch(`/api/products/${productId}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching product: ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchFilters = async () => {
  const response = await fetch('/api/filters');
  
  if (!response.ok) {
    throw new Error(`Error fetching filters: ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchNavigation = async () => {
  const response = await fetch('/api/navigation');
  
  if (!response.ok) {
    throw new Error(`Error fetching navigation: ${response.statusText}`);
  }
  
  return await response.json();
};
