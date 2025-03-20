
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { ProductCardProps } from '../ProductCard';
import { Product } from '@/types/api';

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
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display tracking-wider">{title}</h2>
          
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-brand hover:text-brand-dark transition-colors">
              View All
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
