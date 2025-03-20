
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailSkeleton from '@/modules/products/components/ProductDetailSkeleton';
import ProductDetailError from '@/modules/products/components/ProductDetailError';
import ProductDetailContent from '@/modules/products/components/ProductDetailContent';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProductDetails = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        console.log(`Loading product details for ID: ${productId}`);
        
        // Direct API call to the edge function with no security restrictions
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/product-detail/${productId}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Product details response:', responseData);
        
        // Set the product directly from the response
        setProduct(responseData);
        setError(null);
      } catch (err) {
        console.error('Error loading product details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    loadProductDetails();
  }, [productId]);
  
  if (loading) {
    return <ProductDetailSkeleton />;
  }
  
  if (error) {
    return <ProductDetailError error={error} />;
  }
  
  if (!product) return null;
  
  return <ProductDetailContent product={product} />;
};

export default ProductDetail;
