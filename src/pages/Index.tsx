
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import ProductGrid from '../modules/products/ProductGrid';
import FilterSidebar from '../modules/filters/FilterSidebar';

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-16 overflow-hidden rounded-lg relative">
          <div className="h-[450px] bg-gradient-to-r from-black/95 to-gray-800/95 relative flex items-center">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://via.placeholder.com/1920x400?text=Luxury+Watches" 
                alt="Luxury Watches"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="container mx-auto px-4 md:px-8 z-10">
              <div className="max-w-xl">
                <p className="text-white/80 font-display text-sm uppercase tracking-[0.25em] mb-4">Exclusive Collection</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
                  Timeless <span className="italic font-light">Elegance</span>
                </h1>
                <p className="text-white/90 mb-10 text-lg leading-relaxed">
                  Discover our curated collection of luxury timepieces, where precision meets sophistication.
                </p>
                <button className="bg-white text-black hover:bg-gray-100 transition-colors px-8 py-3.5 rounded-sm font-medium tracking-wider group">
                  <span className="group-hover:mr-2 transition-all">SHOP NOW</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8 tracking-wider">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / <span className="hover:text-black cursor-pointer transition-colors">WOMEN</span> / <span className="font-medium text-gray-900">AIGNER</span>
        </div>
        
        {/* Products with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-10">
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
