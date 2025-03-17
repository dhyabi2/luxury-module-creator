
import React from 'react';

export interface ProductInfoProps {
  brand: string;
  name: string;
  price: number;
  currency: string;
  discount?: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  brand, 
  name, 
  price, 
  currency, 
  discount 
}) => {
  // Calculate discounted price if there's a discount
  const discountedPrice = discount ? price - (price * discount / 100) : null;
  
  return (
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
  );
};

export default ProductInfo;
