
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';
import { useState, useCallback } from 'react';

const ProductCategory = () => {
  const { category } = useParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    priceRange: { min: 0, max: 1225 }
  });
  
  // Use a memoized callback to prevent unnecessary rerenders
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    setActiveFilters(filters);
  }, []);

  // Format category name for display (capitalize first letter, remove hyphens)
  const formatCategoryName = (categorySlug: string) => {
    return categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayName = category ? formatCategoryName(category) : '';
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / <span className="font-medium text-gray-900">{displayName.toUpperCase()}</span>
        </div>
        
        {/* Products with Sidebar - Mobile First Approach */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar - Order first on mobile but last on desktop */}
          <div className="w-full lg:w-1/4 order-first">
            <FilterSidebar 
              initialFilters={{
                priceRange: { min: 0, max: 1225 }
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 order-last lg:order-first mt-6 lg:mt-0">
            <ProductGrid 
              title={displayName} 
              filters={{
                ...activeFilters,
                category: category
              }}
              pageSize={8} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCategory;
