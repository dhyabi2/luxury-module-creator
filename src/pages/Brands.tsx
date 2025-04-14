
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductGrid from '../modules/products/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';

// Brand logo/image interface
interface Brand {
  id: string;
  name: string;
  logo: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Fetch brands data
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        // We'll use placeholder data for now
        // In a real app, this would be fetched from an API
        const dummyBrands: Brand[] = [
          { id: 'rolex', name: 'Rolex', logo: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=100&fit=crop&auto=format' },
          { id: 'omega', name: 'Omega', logo: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=200&h=100&fit=crop&auto=format' },
          { id: 'cartier', name: 'Cartier', logo: 'https://images.unsplash.com/photo-1649155208397-935746511591?w=200&h=100&fit=crop&auto=format' },
          { id: 'tag-heuer', name: 'Tag Heuer', logo: 'https://images.unsplash.com/photo-1623998021450-85c29c644e0d?w=200&h=100&fit=crop&auto=format' },
          { id: 'bulgari', name: 'Bulgari', logo: 'https://images.unsplash.com/photo-1507679799348-fb93ca0b7c32?w=200&h=100&fit=crop&auto=format' },
          { id: 'gucci', name: 'Gucci', logo: 'https://images.unsplash.com/photo-1588222303175-36dc4908aa95?w=200&h=100&fit=crop&auto=format' },
          { id: 'tiffany', name: 'Tiffany & Co', logo: 'https://images.unsplash.com/photo-1602157337140-8acad82331a1?w=200&h=100&fit=crop&auto=format' },
          { id: 'chanel', name: 'Chanel', logo: 'https://images.unsplash.com/photo-1523593288094-3ccfb6b2c192?w=200&h=100&fit=crop&auto=format' },
        ];
        
        setBrands(dummyBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  // Extract brand from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, []);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 tracking-wider">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link> / <span className="font-medium text-gray-900">BRANDS</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 sm:mb-8">Our Brands</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-24 sm:h-32 rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {brands.map(brand => (
              <Link 
                to={`/brands?brand=${brand.id}`} 
                key={brand.id}
                className={`border hover:border-gray-400 transition-colors rounded-md p-3 sm:p-4 flex items-center justify-center h-24 sm:h-32 ${selectedBrand === brand.id ? 'border-black border-2' : 'border-gray-200'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBrand(brand.id);
                  // Update URL without page reload
                  const url = new URL(window.location.href);
                  url.searchParams.set('brand', brand.id);
                  window.history.pushState({}, '', url);
                }}
              >
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
              </Link>
            ))}
          </div>
        )}
        
        {/* Show products for selected brand */}
        {selectedBrand && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">{brands.find(b => b.id === selectedBrand)?.name || 'Brand'} Products</h2>
            <ProductGrid brand={selectedBrand} pageSize={isMobile ? 4 : 8} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Brands;
