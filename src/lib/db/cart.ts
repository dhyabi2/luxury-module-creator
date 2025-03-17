
import { supabase } from "@/integrations/supabase/client";
import { Cart, CartItem } from "@/types/cart";
import { Product } from "@/types/api";

// Retrieve cart from local storage or create a new one
export const getCart = (): Cart => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    return {
      ...parsedCart,
      // Recalculate totals to ensure they're accurate
      totalItems: calculateTotalItems(parsedCart.items),
      subtotal: calculateSubtotal(parsedCart.items),
      discount: calculateDiscount(parsedCart.items),
      total: calculateTotal(parsedCart.items)
    };
  }
  
  // Return empty cart if none exists
  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0
  };
};

// Save cart to local storage
export const saveCart = (cart: Cart): void => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Add item to cart
export const addItemToCart = (product: Product, quantity: number = 1): Cart => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
  
  if (existingItemIndex >= 0) {
    // Increment quantity if item already exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newItem: CartItem = {
      id: Date.now().toString(), // Generate a unique ID for the cart item
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity,
      image: product.image,
      currency: product.currency,
      discount: product.discount
    };
    cart.items.push(newItem);
  }
  
  // Recalculate cart totals
  cart.totalItems = calculateTotalItems(cart.items);
  cart.subtotal = calculateSubtotal(cart.items);
  cart.discount = calculateDiscount(cart.items);
  cart.total = calculateTotal(cart.items);
  
  // Save updated cart
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeItemFromCart = (itemId: string): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  
  // Recalculate cart totals
  cart.totalItems = calculateTotalItems(cart.items);
  cart.subtotal = calculateSubtotal(cart.items);
  cart.discount = calculateDiscount(cart.items);
  cart.total = calculateTotal(cart.items);
  
  // Save updated cart
  saveCart(cart);
  return cart;
};

// Update item quantity
export const updateItemQuantity = (itemId: string, quantity: number): Cart => {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      return removeItemFromCart(itemId);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
  }
  
  // Recalculate cart totals
  cart.totalItems = calculateTotalItems(cart.items);
  cart.subtotal = calculateSubtotal(cart.items);
  cart.discount = calculateDiscount(cart.items);
  cart.total = calculateTotal(cart.items);
  
  // Save updated cart
  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = (): Cart => {
  const emptyCart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0
  };
  saveCart(emptyCart);
  return emptyCart;
};

// Helper functions for calculations
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateDiscount = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    if (item.discount) {
      const itemDiscount = (item.price * item.discount / 100) * item.quantity;
      return total + itemDiscount;
    }
    return total;
  }, 0);
};

const calculateTotal = (items: CartItem[]): number => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(items);
  return subtotal - discount;
};
