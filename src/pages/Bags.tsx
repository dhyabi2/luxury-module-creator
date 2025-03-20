
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import ProductGrid from '@/modules/products/ProductGrid';
import FilterSidebar from '@/modules/filters/FilterSidebar';

const Bags = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    categories: ['bags']
  });
  
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log("Bags page filters changed:", filters);
    setActiveFilters(filters);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Bags Collection</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              initialFilters={activeFilters} 
            />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid 
              category="bags" 
              filters={activeFilters}
              title="Luxury Bags"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Bags;
