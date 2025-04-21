
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CartIcon: React.FC = () => {
  const [totalItems, setTotalItems] = useState(0);
  
  // Direct data reading from localStorage, no hooks/context
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const cart = JSON.parse(storedCart);
          setTotalItems(cart.totalItems || 0);
        }
      } catch (error) {
        console.error('Error reading cart data:', error);
      }
    };
    
    // Initial count
    updateCartCount();
    
    // Update count when storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Create a custom event for internal cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <Link to="/cart">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand text-xs text-white flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
};
