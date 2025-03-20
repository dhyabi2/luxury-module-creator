
import { useState, useEffect } from 'react';
import { useProductCache } from './useProductCache';

export interface ProductDetailData {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  imageUrl: string;
  description?: string;
  category?: string;
  gender?: string;
  caseSize?: number;
}

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCachedResponse, cacheResponse } = useProductCache();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Check cache first
      const cacheKey = `product_${productId}`;
      const cachedData = getCachedResponse(cacheKey);
      
      if (cachedData) {
        setProduct(cachedData);
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        
        // Let error responses propagate
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching product (${response.status}): ${errorText.substring(0, 150)}...`);
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.product);
        
        // Cache the response
        cacheResponse(cacheKey, data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getCachedResponse, cacheResponse]);

  return { product, loading, error };
};
