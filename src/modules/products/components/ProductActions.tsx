
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProductActionsProps {
  isInStock: boolean;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  onDirectCheckout: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  isInStock,
  quantity,
  onQuantityChange,
  onAddToCart,
  onDirectCheckout
}) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button 
          className="w-full bg-brand text-white py-3 rounded-sm hover:bg-brand/90 transition-colors"
          onClick={onAddToCart}
          disabled={!isInStock}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button 
          variant="outline" 
          className="border border-gray-300 p-3 rounded-sm hover:bg-gray-50 transition-colors"
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
      
      <Button 
        className="w-full bg-green-600 text-white py-3 rounded-sm hover:bg-green-700 transition-colors"
        onClick={onDirectCheckout}
        disabled={!isInStock}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Buy Now
      </Button>
    </div>
  );
};

export default ProductActions;
