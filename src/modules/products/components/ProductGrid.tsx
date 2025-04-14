
import React from 'react';
import { Product } from '@/types/api';
import ProductCard from '../ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
