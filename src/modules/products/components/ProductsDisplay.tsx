
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Product } from '@/types/api';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductsDisplayProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  loading?: boolean;
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({
  title,
  products,
  viewAllLink,
  loading = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-display tracking-wider">{title}</h2>
          
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-brand hover:text-brand-dark transition-colors">
              View All
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
            {[...Array(isMobile ? 2 : 4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsDisplay;
