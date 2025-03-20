
import React from 'react';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 mb-6 rounded w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 aspect-square rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
