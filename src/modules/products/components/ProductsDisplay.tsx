
import React from 'react';
import ProductCard, { ProductProps } from '../ProductCard';

interface ProductsDisplayProps {
  products: ProductProps[];
  isLoading: boolean;
  pageSize: number;
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({ 
  products, 
  isLoading, 
  pageSize 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: pageSize }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-md mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products match your selected filters.</p>
        <button 
          className="mt-4 text-brand hover:underline"
          onClick={() => window.location.reload()}
        >
          Clear filters and try again
        </button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="opacity-0 animate-fade-in" 
          style={{ 
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'forwards' 
          }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
};

export default ProductsDisplay;
