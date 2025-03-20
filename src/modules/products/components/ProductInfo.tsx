
import React from 'react';

export interface ProductInfoProps {
  brand: string;
  name: string;
  price?: string;
  discountPercentage?: string | null;
  discountedPrice?: string | null;
  stockStatus?: string;
  stockStatusClass?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  currency?: string;
  discount?: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  brand, 
  name, 
  price, 
  currency,
  discount,
  discountPercentage,
  discountedPrice,
  stockStatus,
  stockStatusClass,
  description,
  rating,
  reviews
}) => {
  // If we're passed raw price/discount values, calculate formatted values
  const formattedPrice = price || (currency ? `${currency} ${typeof price === 'number' ? price.toFixed(2) : '0.00'}` : '$0.00');
  const calculatedDiscountedPrice = discount && typeof price === 'number' 
    ? `${currency || '$'}${(price - (price * discount / 100)).toFixed(2)}` 
    : discountedPrice;
  
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">{brand}</div>
        <h1 className="text-2xl font-medium mb-3">{name}</h1>
        
        {/* Price display */}
        <div className="flex items-center space-x-3 mb-4">
          {calculatedDiscountedPrice ? (
            <>
              <span className="text-xl font-semibold">{calculatedDiscountedPrice}</span>
              <span className="text-gray-500 line-through">{formattedPrice}</span>
              {discountPercentage && (
                <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded">
                  {discountPercentage}
                </span>
              )}
            </>
          ) : (
            <span className="text-xl font-semibold">{formattedPrice}</span>
          )}
        </div>
        
        {/* Stock status */}
        {stockStatus && (
          <div className={`text-sm font-medium mb-4 ${stockStatusClass || ''}`}>
            {stockStatus}
          </div>
        )}
        
        {/* Product description */}
        {description && (
          <div className="mt-6 text-sm text-gray-600 leading-relaxed">
            <h3 className="text-gray-800 font-medium mb-2">Description</h3>
            <p>{description}</p>
          </div>
        )}
      </div>
      
      {/* Ratings */}
      {rating !== undefined && (
        <div className="flex items-center">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {reviews !== undefined && (
            <span className="text-gray-500 text-sm ml-2">({reviews} reviews)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
