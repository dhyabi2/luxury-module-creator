
import React from 'react';
import ProductGridHeader from './ProductGridHeader';

interface ProductGridLoadingProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const ProductGridLoading: React.FC<ProductGridLoadingProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className="space-y-4">
      <ProductGridHeader
        totalProducts={0}
        sortBy={sortBy}
        onSortChange={onSortChange}
        loading={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    </div>
  );
};

export default ProductGridLoading;
