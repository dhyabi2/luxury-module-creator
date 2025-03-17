
import React, { useState } from 'react';

interface ProductDetailImageProps {
  imageUrl: string;
  productName: string;
}

const ProductDetailImage: React.FC<ProductDetailImageProps> = ({ 
  imageUrl, 
  productName 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback image if the product image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop&auto=format';

  return (
    <div className="rounded-lg overflow-hidden">
      <img 
        src={imageError ? fallbackImage : imageUrl} 
        alt={productName} 
        className="w-full h-auto object-cover"
        onError={() => {
          console.log(`Product image failed to load: ${imageUrl}`);
          setImageError(true);
        }}
      />
    </div>
  );
};

export default ProductDetailImage;
