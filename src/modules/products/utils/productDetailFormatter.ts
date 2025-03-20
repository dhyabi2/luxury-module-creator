
import { Product } from '@/types/api';

/**
 * Formats product details for display
 * @param product - The product data to format
 * @returns Formatted product data with display-ready values
 */
export const formatProductDetail = (product: Product | null) => {
  if (!product) {
    return {
      formattedPrice: '$0.00',
      formattedDiscount: null,
      discountedPrice: null,
      formattedDiscountedPrice: null,
      specifications: {},
      isInStock: false,
      stockStatusText: 'Out of Stock',
      stockStatusClass: 'text-red-500'
    };
  }

  // Format price
  const formattedPrice = `$${product.price.toFixed(2)}`;
  
  // Calculate discounted price if applicable
  let discountedPrice = null;
  let formattedDiscountedPrice = null;
  let formattedDiscount = null;
  
  if (product.discount && product.discount > 0) {
    discountedPrice = product.price - (product.price * (product.discount / 100));
    formattedDiscountedPrice = `$${discountedPrice.toFixed(2)}`;
    formattedDiscount = `${product.discount}% Off`;
  }
  
  // Extract specifications from product
  const specifications = product.specifications || {};
  
  // Check if product is in stock
  const isInStock = product.stock > 0;
  
  // Format stock status text and class
  let stockStatusText = 'Out of Stock';
  let stockStatusClass = 'text-red-500';
  
  if (isInStock) {
    if (product.stock < 5) {
      stockStatusText = `Only ${product.stock} left in stock`;
      stockStatusClass = 'text-amber-500';
    } else {
      stockStatusText = 'In Stock';
      stockStatusClass = 'text-green-500';
    }
  }
  
  return {
    formattedPrice,
    formattedDiscount,
    discountedPrice,
    formattedDiscountedPrice,
    specifications,
    isInStock,
    stockStatusText,
    stockStatusClass
  };
};
