
import { Product } from '@/types/api';
import { ProductDetailData } from './useProductDetail';

/**
 * Format product detail data to match the Product interface
 * needed for cart operations
 */
export const formatProductForCart = (
  productDetail: ProductDetailData,
  fallbackImage: string,
  hasImageError: boolean
): Product => {
  return {
    id: productDetail.id,
    name: productDetail.name,
    price: productDetail.price,
    image: hasImageError ? fallbackImage : productDetail.imageUrl,
    brand: productDetail.brand,
    currency: '$',
    category: productDetail.category || '',
    discount: productDetail.onSale && productDetail.originalPrice 
      ? Math.round(((productDetail.originalPrice - productDetail.price) / productDetail.originalPrice) * 100) 
      : undefined
  };
};
