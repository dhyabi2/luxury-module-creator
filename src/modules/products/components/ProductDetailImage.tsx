
import React, { useState } from 'react';

export interface ProductDetailImageProps {
  image: string;
  name: string;
  brand: string;
}

const ProductDetailImage: React.FC<ProductDetailImageProps> = ({ 
  image, 
  name,
  brand
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback image if the product image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop&auto=format';

  return (
    <div className="rounded-lg overflow-hidden">
      <img 
        src={imageError ? fallbackImage : image} 
        alt={name} 
        className="w-full h-auto object-cover"
        onError={() => {
          console.log(`Product image failed to load: ${image}`);
          setImageError(true);
        }}
      />
    </div>
  );
};

export default ProductDetailImage;
