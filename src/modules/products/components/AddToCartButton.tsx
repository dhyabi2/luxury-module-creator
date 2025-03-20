
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Direct API call without hooks - call the cart function
    try {
      // Direct data manipulation without abstraction
      let cart = localStorage.getItem('cart');
      const cartData = cart ? JSON.parse(cart) : { items: [], totalItems: 0 };
      
      // Check if product exists in cart
      const existingProductIndex = cartData.items.findIndex((item: any) => item.productId === productId);
      
      if (existingProductIndex >= 0) {
        // Increment quantity
        cartData.items[existingProductIndex].quantity += 1;
      } else {
        // Add new item with placeholder data
        cartData.items.push({
          id: Date.now().toString(),
          productId: productId,
          quantity: 1,
          // Actual product data would be fetched in a real implementation
          // but for now we just log and use placeholder
          name: "Product",
          price: 0
        });
      }
      
      // Update total items count
      cartData.totalItems = cartData.items.reduce((total: number, item: any) => total + item.quantity, 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartData));
      
      console.log(`Added product ${productId} to cart`, cartData);
      
      // Show toast notification
      toast.success('Added to Cart', {
        description: `Product ID: ${productId} has been added to your cart`
      });
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error);
      
      // Show error toast
      toast.error('Failed to add to cart', {
        description: 'There was an error adding this product to your cart'
      });
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
