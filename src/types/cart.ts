
import { Product } from './api';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  currency: string;
  discount?: number;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  shipping?: {
    method: string;
    cost: number;
  };
}
