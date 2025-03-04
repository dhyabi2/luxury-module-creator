
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 overflow-hidden rounded-lg relative">
          <div className="h-[400px] bg-gradient-to-r from-brand/90 to-brand-dark/90 relative flex items-center">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://via.placeholder.com/1920x400?text=Luxury+Watches" 
                alt="Luxury Watches"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="container mx-auto px-4 z-10">
              <div className="max-w-xl">
                <p className="text-white/80 font-display text-sm uppercase tracking-widest mb-2">Exclusive Collection</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Timeless Elegance</h1>
                <p className="text-white/90 mb-8 text-lg">
                  Discover our curated collection of luxury timepieces, where precision meets sophistication.
                </p>
                <button className="bg-white text-brand hover:bg-gray-100 transition-colors px-8 py-3 rounded-sm font-medium">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span className="hover:text-brand cursor-pointer">HOME</span> / <span className="hover:text-brand cursor-pointer">WOMEN</span> / <span className="font-medium text-gray-900">AIGNER</span>
        </div>
        
        {/* Products with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <ProductGrid title="AIGNER Watches" filteredBrand="AIGNER" pageSize={8} />
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 order-first lg:order-last">
            <FilterSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
