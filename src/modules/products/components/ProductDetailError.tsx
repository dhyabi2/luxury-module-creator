
import React from 'react';

interface ProductDetailErrorProps {
  error: string;
}

const ProductDetailError: React.FC<ProductDetailErrorProps> = ({ error }) => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl text-red-500 mb-4">Error Loading Product</h1>
      <p className="mb-6">{error}</p>
    </div>
  );
};

export default ProductDetailError;
