
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';
import { useState, useCallback, useEffect } from 'react';

const ProductCategory = () => {
  const { category, brandId } = useParams();
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    priceRange: { min: 0, max: 1225 }
  });
  
  // Determine if we're on a brand-specific page
  const isBrandPage = location.pathname.includes('/brands/');
  
  // Reset filters when category or brand changes
  useEffect(() => {
    console.log(`ProductCategory: Path changed to ${location.pathname}, resetting filters`);
    const newFilters: Record<string, any> = {
      priceRange: { min: 0, max: 1225 }
    };
    
    // Add category filter if not on a brand page
    if (category && !isBrandPage) {
      newFilters.categories = [category];
    }
    
    // Add brand filter if on a brand page
    if (brandId) {
      newFilters.brand = brandId;
    }
    
    setActiveFilters(newFilters);
  }, [category, brandId, location.pathname, isBrandPage]);
  
  // Use a memoized callback to prevent unnecessary rerenders
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    // Make sure to preserve the category and/or brand from the URL
    const updatedFilters = { ...filters };
    
    if (category && !isBrandPage) {
      updatedFilters.categories = [category];
    }
    
    if (brandId) {
      updatedFilters.brand = brandId;
    }
    
    setActiveFilters(updatedFilters);
  }, [category, brandId, isBrandPage]);

  // Format category/brand name for display (capitalize first letter, remove hyphens)
  const formatDisplayName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Determine the title to display based on path
  const displayName = brandId 
    ? formatDisplayName(brandId)
    : category 
      ? formatDisplayName(category) 
      : '';
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / 
          {isBrandPage && (
            <>
              <span className="hover:text-black cursor-pointer transition-colors">BRANDS</span> / 
            </>
          )}
          <span className="font-medium text-gray-900">{displayName.toUpperCase()}</span>
        </div>
        
        {/* Products with Sidebar - Mobile First Approach */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar - Order first on mobile but last on desktop */}
          <div className="w-full lg:w-1/4 order-first">
            <FilterSidebar 
              initialFilters={{
                priceRange: { min: 0, max: 1225 },
                ...(category && !isBrandPage ? { categories: [category] } : {}),
                ...(brandId ? { brand: brandId } : {})
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 order-last lg:order-first mt-6 lg:mt-0">
            <ProductGrid 
              title={displayName} 
              filters={activeFilters}
              pageSize={8} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCategory;
