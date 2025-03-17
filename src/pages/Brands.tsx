
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Brand logo/image interface
interface Brand {
  id: string;
  name: string;
  logo: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch brands data
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        // We'll use placeholder data for now
        // In a real app, this would be fetched from an API
        const dummyBrands: Brand[] = [
          { id: 'rolex', name: 'Rolex', logo: 'https://via.placeholder.com/200x100?text=Rolex' },
          { id: 'omega', name: 'Omega', logo: 'https://via.placeholder.com/200x100?text=Omega' },
          { id: 'cartier', name: 'Cartier', logo: 'https://via.placeholder.com/200x100?text=Cartier' },
          { id: 'tag-heuer', name: 'Tag Heuer', logo: 'https://via.placeholder.com/200x100?text=TagHeuer' },
          { id: 'bulgari', name: 'Bulgari', logo: 'https://via.placeholder.com/200x100?text=Bulgari' },
          { id: 'gucci', name: 'Gucci', logo: 'https://via.placeholder.com/200x100?text=Gucci' },
          { id: 'tiffany', name: 'Tiffany & Co', logo: 'https://via.placeholder.com/200x100?text=Tiffany' },
          { id: 'chanel', name: 'Chanel', logo: 'https://via.placeholder.com/200x100?text=Chanel' },
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
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="text-xs sm:text-sm text-gray-600 mb-6 tracking-wider">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link> / <span className="font-medium text-gray-900">BRANDS</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6 sm:mb-10">Our Brands</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {brands.map(brand => (
              <Link 
                to={`/brands/${brand.id}`} 
                key={brand.id}
                className="border border-gray-200 hover:border-gray-400 transition-colors rounded-md p-4 flex items-center justify-center h-32"
              >
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Brands;
