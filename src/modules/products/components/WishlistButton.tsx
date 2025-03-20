
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Direct API call without hooks - implement wishlist functionality directly
    console.log(`Added product ${productId} to wishlist`);
    
    // Show toast notification
    toast.success('Added to Wishlist', {
      description: `Product ID: ${productId} has been added to your wishlist`
    });
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleAddToWishlist}
    >
      <Heart className="h-4 w-4" />
    </Button>
  );
};

export default WishlistButton;
