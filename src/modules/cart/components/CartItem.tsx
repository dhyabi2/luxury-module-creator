
import React from 'react';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  // Calculate discounted price if applicable
  const finalPrice = item.discount 
    ? (item.price - (item.price * item.discount / 100)).toFixed(2)
    : item.price.toFixed(2);

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="flex py-4 border-b border-gray-100">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Link to={`/product/${item.productId}`}>
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center"
          />
        </Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link to={`/product/${item.productId}`}>
              <h3 className="text-base font-medium text-gray-900 hover:text-brand transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
          </div>
          <p className="text-right text-sm font-medium text-gray-900">
            {item.currency}{finalPrice}
            {item.discount && (
              <span className="ml-1 text-xs line-through text-gray-400">
                {item.currency}{item.price.toFixed(2)}
              </span>
            )}
          </p>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center border border-gray-200 rounded-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900 mr-2">
              {item.currency}{itemTotal}
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-400 hover:text-red-500"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
