
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Added product ${productId} to cart`);
      }}
    >
      <ShoppingCart className="h-4 w-4" />
    </Button>
  );
};

export default AddToCartButton;
