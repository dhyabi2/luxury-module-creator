
/**
 * Process products data for consistency and validation
 * 
 * @param products - Raw products from the database
 * @returns Processed products with validated image URLs
 */
export const processProducts = (products: any[]) => {
  console.log('[DB:products] Processing products data');
  return products.map(product => {
    // Validate image URL
    if (!product.image || !product.image.startsWith('http')) {
      // Set fallback image if missing or invalid
      console.log(`[DB:products] Replacing invalid image for product ${product.id}`);
      return {
        ...product,
        image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8'
      };
    }
    return product;
  });
};
