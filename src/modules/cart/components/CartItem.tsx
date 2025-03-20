
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '@/types/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);
  
  // Ensure we're using the correct ID for the product link
  const productId = item.productId || item.id;
  
  // Fallback image if the item image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=200&h=200&fit=crop&auto=format';
  
  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex py-4 border-b border-gray-100">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Link to={`/product/${productId}`}>
          <img 
            src={imageError ? fallbackImage : item.image} 
            alt={item.name} 
            className="h-full w-full object-cover object-center"
            onError={() => {
              console.log(`Cart item image failed to load: ${item.image}`);
              setImageError(true);
            }}
          />
        </Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/product/${productId}`}>
                {item.name}
              </Link>
            </h3>
            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleDecrement}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="px-1 text-gray-700">{item.quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleIncrement}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-800" 
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
