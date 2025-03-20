
import { Product } from '@/types/api';
import { toast } from 'sonner';

export interface ProductsResponse {
  products: Product[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export const fetchProducts = async (queryParams: string): Promise<ProductsResponse | null> => {
  try {
    // Direct API call to the edge function with no security restrictions
    const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
    
    console.log('Fetching products with params:', queryParams);
    
    // Make the request with completely open access - direct API call
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${queryParams}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status, response.statusText);
      toast.error('Failed to load products', {
        description: 'Please try again later.'
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Products data received:', data);
    return data;
  } catch (err) {
    console.error('Error loading products:', err);
    toast.error('Failed to load products', {
      description: 'Please try again later.'
    });
    return null;
  }
};
