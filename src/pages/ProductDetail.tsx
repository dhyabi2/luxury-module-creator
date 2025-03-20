
import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '@/utils/apiUtils';
import ProductDetailSkeleton from '@/modules/products/components/ProductDetailSkeleton';
import ProductDetailError from '@/modules/products/components/ProductDetailError';
import ProductDetailContent from '@/modules/products/components/ProductDetailContent';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const loadProductDetails = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        console.log(`Loading product details for ID: ${productId}`);
        const response = await fetchProductById(productId);
        console.log('Product details response:', response);
        setProduct(response.product);
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
