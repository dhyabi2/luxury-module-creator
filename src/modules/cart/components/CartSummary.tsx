
import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        
        {/* Rule 1: Show shipping information */}
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">Shipping</p>
          <p className="font-medium">Free</p>
        </div>
        
        {/* Rule 2: Show tax information */}
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">Taxes (estimated)</p>
          <p className="font-medium">${(cart.subtotal * 0.1).toFixed(2)}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <p className="text-base font-medium">Total</p>
          <p className="text-base font-medium">${cart.total.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Rule 3: Show secure payment information */}
      <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <Shield className="h-4 w-4" />
        <span>Secure checkout</span>
      </div>
      
      <div className="mt-6 space-y-3">
        {/* Rule 4: Clear checkout button */}
        <Button className="w-full py-5 bg-brand hover:bg-brand/90 flex items-center justify-center">
          <CreditCard className="mr-2 h-4 w-4" /> 
          Checkout
        </Button>
        
        {/* Rule 5: Continue shopping option */}
        <Link to="/" className="block text-center text-sm text-gray-600 hover:text-gray-800 mt-2">
          Continue shopping
        </Link>
        
        {/* Rule 6: Clear cart option */}
        {cart.items.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        )}
        
        {/* Rule 7: Trust signals */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center">
              <span>Free Returns</span>
            </div>
            <div className="flex items-center">
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
