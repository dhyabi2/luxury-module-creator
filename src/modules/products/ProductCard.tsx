
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  discount?: number;
  category: string;
  brand: string;
}

const ProductCard: React.FC<ProductProps> = ({ 
  id, 
  name, 
  price, 
  currency, 
  image, 
  discount, 
  category,
  brand
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discounted price if there's a discount
  const discountedPrice = discount ? price - (price * discount / 100) : null;
  
  return (
    <Link to={`/product/${id}`} className="block h-full w-full">
      <div 
        className="product-card group h-full flex flex-col relative overflow-hidden rounded-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-card-img-container aspect-square bg-gray-50 flex-shrink-0 relative">
          <img 
            src={image} 
            alt={name}
            className="product-card-img object-contain w-full h-full p-4"
            loading="lazy"
          />
          
          {discount && (
            <div className="absolute top-2 right-2 bg-sale text-white text-xs font-medium py-1 px-2 rounded-sm">
              SAVE {discount}%
            </div>
          )}
          
          <div 
            className={`absolute inset-0 bg-black bg-opacity-5 opacity-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : ''
            }`}
          />
        </div>
        
        <div className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2 sm:mb-3">{brand}</div>
            <h3 className="font-medium text-xs sm:text-sm md:text-base line-clamp-2 mb-2 sm:mb-4">
              {name}
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 py-2 sm:py-3 mt-auto">
            {discountedPrice ? (
              <>
                <span className="font-semibold text-sm sm:text-base md:text-lg">{currency} {discountedPrice.toFixed(1)}</span>
                <span className="text-gray-500 text-xs sm:text-sm line-through">{currency} {price.toFixed(1)}</span>
              </>
            ) : (
              <span className="font-semibold text-sm sm:text-base md:text-lg">{currency} {price.toFixed(1)}</span>
            )}
          </div>
        </div>
        
        {/* Mobile-friendly view details button - always visible on touch devices */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-2 sm:py-3 text-xs sm:text-sm font-medium transform translate-y-full transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : ''
          } md:hidden`}
        >
          View Details
        </div>
        
        {/* Desktop view details button */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-3 text-sm font-medium transform translate-y-full transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : ''
          } hidden md:block`}
        >
          View Details
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
