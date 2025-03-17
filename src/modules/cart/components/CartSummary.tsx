
import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export const CartSummary: React.FC = () => {
  const { cart, clearCart } = useCart();
  
  return (
    <div className="mt-4">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">Subtotal</p>
          <p className="font-medium">${cart.subtotal.toFixed(2)}</p>
        </div>
        
        {cart.discount > 0 && (
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">Discount</p>
            <p className="font-medium text-red-500">-${cart.discount.toFixed(2)}</p>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <p className="text-base font-medium">Total</p>
          <p className="text-base font-medium">${cart.total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <Button className="w-full py-5 bg-brand hover:bg-brand/90">
          <ShoppingBag className="mr-2 h-4 w-4" /> Checkout
        </Button>
        
        {cart.items.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        )}
      </div>
    </div>
  );
};
