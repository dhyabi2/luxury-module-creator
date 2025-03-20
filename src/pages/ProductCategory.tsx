
import React from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import ProductGrid from '@/modules/products/ProductGrid';
import FilterSidebar from '@/modules/filters/FilterSidebar';

interface ProductCategoryProps {
  gender: string;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ gender }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{gender}'s Collection</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid gender={gender} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCategory;
