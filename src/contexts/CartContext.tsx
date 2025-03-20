
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/types/cart';
import { cartDb } from '@/lib/db';
import { Product } from '@/types/api';
import { toast } from 'sonner';

// Define the context type
interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cart: {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0
  },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isOpen: false,
  openCart: () => {},
  closeCart: () => {}
});

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(cartDb.getCart());
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    setCart(cartDb.getCart());
  }, []);

  // Add item to cart
  const addItem = (product: Product, quantity: number = 1) => {
    console.log('Adding product to cart:', product);
    const updatedCart = cartDb.addItemToCart(product, quantity);
    setCart(updatedCart);
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
      duration: 2000
    });
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    const updatedCart = cartDb.removeItemFromCart(itemId);
    setCart(updatedCart);
    toast.success("Removed from cart", {
      description: "Item has been removed from your cart.",
      duration: 2000
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cartDb.updateItemQuantity(itemId, quantity);
    setCart(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    const updatedCart = cartDb.clearCart();
    setCart(updatedCart);
    toast.success("Cart cleared", {
      description: "All items have been removed from your cart.",
      duration: 2000
    });
  };

  // Open cart drawer
  const openCart = () => {
    setIsOpen(true);
  };

  // Close cart drawer
  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom function to use the cart context
export const useCart = () => useContext(CartContext);
