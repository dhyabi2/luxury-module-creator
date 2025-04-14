
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import ProductGrid from '@/modules/products/ProductGrid';
import FilterSidebar from '@/modules/filters/FilterSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Perfumes = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    categories: ['perfumes']
  });
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log("Perfumes page filters changed:", filters);
    setActiveFilters(filters);
    if (isMobile) {
      setShowFilters(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">MKWatches Perfumes Collection</h1>
        
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <div className="mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md flex justify-between items-center"
            >
              <span>Filter Perfumes</span>
              <span>{showFilters ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Conditionally shown on mobile */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'block'} lg:col-span-1`}>
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              initialFilters={activeFilters} 
            />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid 
              category="perfumes" 
              filters={activeFilters}
              title="Luxury Perfumes"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Perfumes;
