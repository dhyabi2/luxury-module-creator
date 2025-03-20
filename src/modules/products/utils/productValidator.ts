
import { Product } from '@/types/api';
import { ProductCardProps } from '../ProductCard';

export const validateProducts = (data: any): Product[] => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid products data received:', data);
    return [];
  }
  
  return data.map(item => ({
    id: item.id || `product-${Math.random().toString(36).substring(2, 9)}`,
    name: item.name || 'Unnamed Product',
    price: parseFloat(item.price) || 0,
    currency: item.currency || '$',
    image: item.image || 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8',
    category: item.category || 'uncategorized',
    brand: item.brand || 'Unknown',
    discount: item.discount || null,
    description: item.description || null,
    specifications: item.specifications || {},
    stock: item.stock || 0,
    rating: item.rating || 0,
    reviews: item.reviews || 0
  }));
};

export const validateProduct = (data: any): Product => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid product data received:', data);
    throw new Error('Invalid product data');
  }
  
  return {
    id: data.id || `product-${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'Unnamed Product',
    price: parseFloat(data.price) || 0,
    currency: data.currency || '$',
    image: data.image || 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8',
    category: data.category || 'uncategorized',
    brand: data.brand || 'Unknown',
    discount: data.discount || null,
    description: data.description || null,
    specifications: data.specifications || {},
    stock: data.stock || 0,
    rating: data.rating || 0,
    reviews: data.reviews || 0
  };
};
