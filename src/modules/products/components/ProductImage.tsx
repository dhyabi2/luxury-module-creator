
import React, { useState } from 'react';

export interface ProductImageProps {
  image: string;
  name: string;
  discount?: number;
  isHovered: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  image, 
  name, 
  discount, 
  isHovered 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Improved fallback image if the main image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop&auto=format';
  
  return (
    <div className="product-card-img-container aspect-square bg-gray-50 flex-shrink-0 relative">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img 
        src={imageError ? fallbackImage : image} 
        alt={name}
        className={`product-card-img object-cover w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          console.log(`Image failed to load: ${image}`);
          setImageError(true);
          setImageLoaded(true);
        }}
      />
      
      {discount && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium py-1 px-2 rounded-sm">
          SAVE {discount}%
        </div>
      )}
      
      <div 
        className={`absolute inset-0 bg-black bg-opacity-5 opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />
    </div>
  );
};

export default ProductImage;
