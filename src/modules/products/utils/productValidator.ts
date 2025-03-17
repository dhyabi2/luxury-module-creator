
import { ProductProps } from '../ProductCard';

/**
 * Validates and fixes product image URLs
 * Extracts this functionality from the useProductFetching hook
 */
export const validateProductImages = (productsData: any[]): ProductProps[] => {
  return productsData.map((product) => {
    const validImageUrl = product.imageUrl && typeof product.imageUrl === 'string' && 
      (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://'));
    
    if (!validImageUrl) {
      console.log(`[ProductGrid] Fixing invalid image URL for product: ${product.id}`);
      return {
        ...product,
        imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format'
      };
    }
    return product;
  });
};
