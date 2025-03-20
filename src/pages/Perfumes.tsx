
import React, { useState, useCallback } from 'react';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';

const Perfumes = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    priceRange: { min: 0, max: 1225 },
    category: 'perfumes' // Set the category filter to perfumes
  });
  
  // Use a callback to prevent unnecessary rerenders
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    setActiveFilters({
      ...filters,
      category: 'perfumes' // Always keep the perfumes category filter
    });
  }, []);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Banner */}
        <div className="mb-8 sm:mb-12 overflow-hidden rounded-lg relative">
          <div className="h-[200px] sm:h-[250px] bg-gray-500 relative flex items-center">
            <div className="container mx-auto px-4 md:px-8 z-10">
              <div className="max-w-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  LUXURY PERFUMES
                </h1>
                <p className="text-white/90 mb-6 text-sm sm:text-base leading-relaxed">
                  Explore our collection of exquisite fragrances from prestigious brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / <span className="font-medium text-gray-900">PERFUMES</span>
        </div>
        
        {/* Products with Sidebar - Mobile First Approach */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar - Order first on mobile but last on desktop */}
          <div className="w-full lg:w-1/4 order-first">
            <FilterSidebar 
              initialFilters={{
                priceRange: { min: 0, max: 1225 },
                category: 'perfumes'
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 order-last lg:order-first mt-6 lg:mt-0">
            <ProductGrid 
              title="Perfumes Collection" 
              filters={activeFilters}
              pageSize={8} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Perfumes;
