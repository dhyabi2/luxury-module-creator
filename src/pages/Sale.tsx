
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';
import { useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sale = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    priceRange: { min: 0, max: 1225 },
    discount: true // Filtering for discounted items
  });
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Use a memoized callback to prevent unnecessary rerenders
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    setActiveFilters({
      ...filters,
      discount: true // Always keep discount filter
    });
    if (isMobile) {
      setShowFilters(false);
    }
  }, [isMobile]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Sale Banner */}
        <div className="mb-6 sm:mb-12 overflow-hidden rounded-lg relative">
          <div className="h-[150px] xs:h-[200px] sm:h-[250px] bg-sale relative flex items-center">
            <div className="container mx-auto px-4 md:px-8 z-10">
              <div className="max-w-xl">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-6">
                  SALE
                </h1>
                <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Discover exceptional discounts on select luxury items. Limited time offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-8 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / <span className="font-medium text-gray-900">SALE</span>
        </div>
        
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <div className="mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md flex justify-between items-center"
            >
              <span>Filter Sale Items</span>
              <span>{showFilters ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
        
        {/* Products with Sidebar - Mobile First Approach */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar - Conditionally shown on mobile */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'block'} w-full lg:w-1/4 lg:order-first`}>
            <FilterSidebar 
              initialFilters={{
                priceRange: { min: 0, max: 1225 },
                discount: true
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 mt-4 lg:mt-0">
            <ProductGrid 
              title="Sale Items" 
              filters={activeFilters}
              pageSize={8} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sale;
