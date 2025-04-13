
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import ProductGrid from '@/modules/products/ProductGrid';
import FilterSidebar from '@/modules/filters/FilterSidebar';

const Watches = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    categories: ['watches']
  });
  
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log("Watches page filters changed:", filters);
    setActiveFilters(filters);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-page-title font-display text-brand-dark mb-6">Watches Collection</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              initialFilters={activeFilters} 
            />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid 
              category="watches" 
              filters={activeFilters}
              title="Luxury Watches"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Watches;
