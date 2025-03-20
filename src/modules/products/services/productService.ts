
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
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
    
    console.log('Fetching products with params:', queryParams);
    
    // Strip out case size parameters if on accessories page to avoid 500 errors
    let cleanedParams = queryParams;
    if (queryParams.includes('category=accessories')) {
      cleanedParams = queryParams
        .replace(/&minCaseSize=\d+/, '')
        .replace(/&maxCaseSize=\d+/, '');
      console.log('Using cleaned params for accessories:', cleanedParams);
    }
    
    // Make the request with completely open access but include the API key
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${cleanedParams}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status, response.statusText);
      
      // If we get a 500 error and have case size parameters, try again without them
      if (response.status === 500 && queryParams.includes('minCaseSize') && !cleanedParams.includes('accessories')) {
        console.log('Retrying without case size parameters');
        const fallbackParams = queryParams
          .replace(/&minCaseSize=\d+/, '')
          .replace(/&maxCaseSize=\d+/, '');
          
        const fallbackResponse = await fetch(`${SUPABASE_URL}/functions/v1/products?${fallbackParams}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log('Products data received (fallback):', data);
          return data;
        }
      }
      
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
