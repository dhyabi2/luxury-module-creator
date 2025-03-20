
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';

export interface ProductActionsProps {
  isInStock: boolean;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  isInStock,
  quantity,
  onQuantityChange,
  onAddToCart
}) => {
  return (
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
  );
};

export default ProductActions;
