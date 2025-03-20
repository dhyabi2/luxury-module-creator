
import { useState, useEffect } from 'react';
import { Product } from '@/types/api';
import { toast } from 'sonner';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch product data directly from edge function
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!productId) {
          throw new Error('Product ID is required');
        }
        
        console.log(`Fetching product details for ID: ${productId}`);
        const response = await fetch(`/api/product-detail/${productId}`);
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Product data received:', data);
        
        if (!data.product) {
          throw new Error("Product not found");
        }
        
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load product details');
        }
        toast.error('Failed to load product', {
          description: 'Please try again later.',
          duration: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProduct();
  }, [productId]);

  return { product, loading, error };
};
