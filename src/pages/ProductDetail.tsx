
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/modules/products/hooks/useProductDetail';
import ProductDetailSkeleton from '@/modules/products/components/ProductDetailSkeleton';
import ProductDetailError from '@/modules/products/components/ProductDetailError';
import ProductDetailContent from '@/modules/products/components/ProductDetailContent';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error } = useProductDetail(productId);
  
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
