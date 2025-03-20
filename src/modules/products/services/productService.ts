
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
    // Direct API call to the edge function
    const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
    
    console.log('Fetching products with params:', queryParams);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${queryParams}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
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
