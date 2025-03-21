
import React from 'react';
import ProductCard from '../ProductCard';
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductGridContent;
