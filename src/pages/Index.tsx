
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    priceRange: { min: 0, max: 1225 }
  });
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Use a memoized callback to prevent unnecessary rerenders
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    setActiveFilters(filters);
    if (isMobile) {
      setShowFilters(false);
    }
  }, [isMobile]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-16 overflow-hidden rounded-lg relative">
          <div className="h-[250px] xs:h-[300px] sm:h-[350px] md:h-[450px] bg-gradient-to-r from-black/95 to-gray-800/95 relative flex items-center">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1920&h=400&fit=crop&auto=format" 
                alt="Luxury Watches"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="container mx-auto px-4 md:px-8 z-10">
              <div className="max-w-xl">
                <p className="text-white/80 font-display text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] mb-3 sm:mb-4">Exclusive Collection</p>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 leading-tight">
                  Luxury <span className="italic font-light">Lifestyle</span>
                </h1>
                <p className="text-white/90 mb-6 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed">
                  Discover our curated collection of luxury accessories, bags, and perfumes for the discerning customer.
                </p>
                <Link to="/watches" className="inline-block">
                  <button className="bg-white text-black hover:bg-gray-100 transition-colors px-6 sm:px-8 py-3 sm:py-3.5 rounded-sm font-medium tracking-wider group text-sm sm:text-base">
                    <span className="group-hover:mr-2 transition-all">SHOP NOW</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-black cursor-pointer transition-colors">HOME</Link> / 
          <Link to="/watches" className="hover:text-black cursor-pointer transition-colors">COLLECTIONS</Link> / 
          <span className="font-medium text-gray-900">LUXURY LIFESTYLE</span>
        </div>
        
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <div className="mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md flex justify-between items-center"
            >
              <span>Filter Products</span>
              <span>{showFilters ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
        
        {/* Products with Sidebar - Mobile First Approach */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar - Conditionally shown on mobile */}
          <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'block'} w-full lg:w-1/4 lg:sticky lg:top-24 lg:h-fit`}>
            <FilterSidebar 
              initialFilters={{
                priceRange: { min: 0, max: 1225 }
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
            <ProductGrid 
              title="Luxury Lifestyle" 
              filters={activeFilters}
              pageSize={8} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
