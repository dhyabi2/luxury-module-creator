
import { Product } from '@/types/api';

export const formatProductData = (product: Product | null) => {
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
  
  // Handle different currency formats
  const currencySymbol = product.currency === 'OMR' ? 'OMR ' : '$';
  
  // Format price
  const formattedPrice = `${currencySymbol}${product.price.toFixed(2)}`;
  
  // Calculate discounted price if applicable
  let discountedPrice = null;
  let formattedDiscountedPrice = null;
  let formattedDiscount = null;
  
  if (product.discount && product.discount > 0) {
    discountedPrice = product.price - (product.price * (product.discount / 100));
    formattedDiscountedPrice = `${currencySymbol}${discountedPrice.toFixed(2)}`;
    formattedDiscount = `${product.discount}% Off`;
  }
  
  // Extract specifications from product
  const specifications = product.specifications || {};
  
  // Check if product is in stock
  const isInStock = product.stock ? product.stock > 0 : false;
  
  // Format stock status text and class
  let stockStatusText = 'Out of Stock';
  let stockStatusClass = 'text-red-500';
  
  if (isInStock && product.stock) {
    if (product.stock < 5) {
      stockStatusText = `Only ${product.stock} left in stock`;
      stockStatusClass = 'text-amber-500';
    } else {
      stockStatusText = 'In Stock';
      stockStatusClass = 'text-green-500';
    }
  }
  
  console.log('Formatted product data:', {
    formattedPrice,
    formattedDiscount,
    discountedPrice,
    formattedDiscountedPrice,
    specifications,
    isInStock,
    stockStatusText,
    stockStatusClass
  });
  
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
