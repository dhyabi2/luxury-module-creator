
import React from 'react';
import ProductGrid from './ProductGrid';
import ProductPagination from './ProductPagination';
import { Product } from '@/types/api';

interface ProductGridContentProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductGridContent: React.FC<ProductGridContentProps> = ({
  products,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ProductGrid products={products} />
      
      <div className="flex justify-center mt-4 sm:mt-8">
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ProductGridContent;
