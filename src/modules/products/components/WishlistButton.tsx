
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Added product ${productId} to wishlist`);
      }}
    >
      <Heart className="h-4 w-4" />
    </Button>
  );
};

export default WishlistButton;
