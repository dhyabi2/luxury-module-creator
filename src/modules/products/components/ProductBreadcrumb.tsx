
import React from 'react';
import { Link } from 'react-router-dom';

export interface ProductBreadcrumbProps {
  category?: string;
  productName: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ 
  productName, 
  category 
}) => {
  return (
    <div className="text-xs sm:text-sm text-gray-600 mb-6 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/" className="hover:text-black transition-colors">HOME</Link> / 
      {category && (
        <>
          <Link to={`/${category.toLowerCase()}`} className="hover:text-black transition-colors">
            {category.toUpperCase()}
          </Link> / 
        </>
      )}
      <span className="font-medium text-gray-900">{productName || 'Product Details'}</span>
    </div>
  );
};

export default ProductBreadcrumb;
