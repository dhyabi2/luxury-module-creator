
import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import CartItem from './CartItem';
import { CartSummary } from './CartSummary';
import { ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart } = useCart();
  
  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {cart.totalItems > 0 
              ? `You have ${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is empty'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1">
          {cart.items.length > 0 ? (
            <div className="flex flex-col divide-y">
              {cart.items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm text-center">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
          )}
        </div>
        
        {cart.items.length > 0 && <CartSummary />}
      </SheetContent>
    </Sheet>
  );
};
