
import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CartIcon: React.FC = () => {
  const { cart, openCart } = useCart();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={openCart}
      className="relative"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {cart.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand text-xs text-white flex items-center justify-center">
          {cart.totalItems > 9 ? '9+' : cart.totalItems}
        </span>
      )}
    </Button>
  );
};
