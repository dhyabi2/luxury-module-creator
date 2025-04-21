
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/api';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, quantity = 1 }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Adding to cart:', product, 'Quantity:', quantity);
    
    // Direct data manipulation without abstraction
    try {
      const storedCart = localStorage.getItem('cart');
      const cart = storedCart ? JSON.parse(storedCart) : { 
        items: [], 
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      };
      
      // Check if product exists in cart
      const existingProductIndex = cart.items.findIndex((item: any) => item.productId === product.id);
      
      if (existingProductIndex >= 0) {
        // Increment quantity
        cart.items[existingProductIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: quantity,
          image: product.image,
          currency: product.currency,
          discount: product.discount
        });
      }
      
      // Recalculate totals
      cart.totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
      cart.subtotal = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
      cart.discount = cart.items.reduce((total: number, item: any) => {
        if (item.discount) {
          return total + ((item.price * item.discount / 100) * item.quantity);
        }
        return total;
      }, 0);
      cart.total = cart.subtotal - cart.discount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      toast.success('Added to Cart', {
        description: `${product.name} has been added to your cart`
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add to cart');
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-4 w-4" />
    </Button>
  );
};

export default AddToCartButton;
