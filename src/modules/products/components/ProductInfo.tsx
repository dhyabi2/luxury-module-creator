
import React from 'react';

export interface ProductInfoProps {
  brand: string;
  name: string;
  price: string | number;
  currency?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
  discountPercentage?: string;
  discountedPrice?: string;
  stockStatus?: string;
  stockStatusClass?: string;
  description?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  brand,
  name,
  price,
  currency = 'OMR',
  discount,
  rating,
  reviews,
  discountPercentage,
  discountedPrice,
  stockStatus,
  stockStatusClass,
  description
}) => {
  // Parse numeric price if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
  
  // Calculate discounted price if not provided but discount is available
  const calculatedDiscountedPrice = discount && !isNaN(numericPrice)
    ? numericPrice - (numericPrice * (discount / 100)) 
    : null;
  
  const displayPrice = typeof price === 'string' ? price : `${currency} ${numericPrice.toFixed(2)}`;
  const displayDiscountedPrice = discountedPrice || (calculatedDiscountedPrice ? `${currency} ${calculatedDiscountedPrice.toFixed(2)}` : null);
  const displayDiscountPercentage = discountPercentage || (discount ? `${discount}% Off` : null);
  
  return (
    <div className="mt-2 space-y-1">
      <div className="text-sm text-gray-500 capitalize">{brand}</div>
      <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
      
      <div className="flex items-baseline space-x-2">
        {displayDiscountedPrice ? (
          <>
            <span className="text-brand font-medium">{displayDiscountedPrice}</span>
            <span className="text-gray-400 line-through text-sm">{displayPrice}</span>
            {displayDiscountPercentage && (
              <span className="text-brand text-xs font-medium">{displayDiscountPercentage}</span>
            )}
          </>
        ) : (
          <span className="font-medium">{displayPrice}</span>
        )}
      </div>
      
      {(rating !== undefined && reviews !== undefined) && (
        <div className="flex items-center text-sm">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={i < Math.round(rating) ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={i < Math.round(rating) ? 0 : 1.5}
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
                />
              </svg>
            ))}
          </div>
          <span className="text-gray-500">({reviews})</span>
        </div>
      )}
      
      {stockStatus && (
        <div className={`text-sm ${stockStatusClass || 'text-green-500'}`}>
          {stockStatus}
        </div>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
};

export default ProductInfo;
