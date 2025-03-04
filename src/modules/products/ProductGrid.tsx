
import React, { useState, useEffect } from 'react';
import ProductCard, { ProductProps } from './ProductCard';

// Sample product data
const sampleProducts: ProductProps[] = [
  {
    id: '1',
    name: 'AIGNER ALBA WOMEN\'S WATCH 36MM',
    price: 299.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+1',
    category: 'watches',
    brand: 'AIGNER',
    discount: 20
  },
  {
    id: '2',
    name: 'AIGNER ALESSANDRA LADIES WATCH 30MM',
    price: 272.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+2',
    category: 'watches',
    brand: 'AIGNER'
  },
  {
    id: '3',
    name: 'AIGNER RAVENNA LADIES WATCH 33MM GOLD',
    price: 310.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+3',
    category: 'watches',
    brand: 'AIGNER',
    discount: 15
  },
  {
    id: '4',
    name: 'AIGNER PORTOFINO LADIES WATCH 32MM SILVER',
    price: 259.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+4',
    category: 'watches',
    brand: 'AIGNER'
  },
  {
    id: '5',
    name: 'AIGNER SIENA DIAMOND LADIES WATCH 28MM',
    price: 350.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+5',
    category: 'watches',
    brand: 'AIGNER',
    discount: 10
  },
  {
    id: '6',
    name: 'AIGNER GARDA LADIES WATCH 32MM ROSE GOLD',
    price: 285.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+6',
    category: 'watches',
    brand: 'AIGNER'
  },
  {
    id: '7',
    name: 'AIGNER PRATO LADIES WATCH 36MM GOLD',
    price: 320.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+7',
    category: 'watches',
    brand: 'AIGNER'
  },
  {
    id: '8',
    name: 'AIGNER MODENA LADIES WATCH 33MM SILVER',
    price: 290.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+8',
    category: 'watches',
    brand: 'AIGNER',
    discount: 25
  }
];

// Generate more products by duplicating and modifying the sample products
const generateProducts = (count: number): ProductProps[] => {
  const products = [...sampleProducts];
  const totalNeeded = count - products.length;
  
  if (totalNeeded <= 0) return products.slice(0, count);
  
  for (let i = 0; i < totalNeeded; i++) {
    const sourceProd = products[i % products.length];
    products.push({
      ...sourceProd,
      id: `extended-${i+9}`,
      name: `${sourceProd.name} ${i+9}`,
      price: Math.round((sourceProd.price * (0.9 + Math.random() * 0.3)) * 10) / 10,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : undefined
    });
  }
  
  return products;
};

interface ProductGridProps {
  title?: string;
  filteredBrand?: string;
  pageSize?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title = 'Products', 
  filteredBrand, 
  pageSize = 8 
}) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = 32; // Mock total count
  
  // Simulate loading products
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      const generatedProducts = generateProducts(pageSize);
      setProducts(generatedProducts);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pageSize, currentPage, filteredBrand]);

  const handleSort = (option: string) => {
    setSortOption(option);
    
    // Sort products based on the selected option
    let sortedProducts = [...products];
    
    switch (option) {
      case 'price-low':
        sortedProducts.sort((a, b) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        // For this demo, we'll just randomize the sort order
        sortedProducts.sort(() => Math.random() - 0.5);
        break;
      default:
        // 'featured' - leave in default order
        break;
    }
    
    setProducts(sortedProducts);
  };
  
  return (
    <div>
      {title && (
        <h2 className="text-2xl font-serif mb-4">{title}</h2>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b">
        <div className="text-sm text-gray-600 mb-3 md:mb-0">
          Showing 1–{Math.min(pageSize, totalProducts)} of {totalProducts} items
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select 
            className="text-sm border-gray-200 rounded-sm py-1 pr-8 pl-2 focus:border-brand focus:ring-0"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="opacity-0 animate-fade-in" 
              style={{ 
                animationDelay: `${parseInt(product.id) * 50}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-1 text-sm">
          <button 
            className="px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, Math.ceil(totalProducts / pageSize)) }, (_, i) => (
            <button 
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded-sm ${
                currentPage === i + 1 
                  ? 'bg-brand text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            className="px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100"
            disabled={currentPage === Math.ceil(totalProducts / pageSize)}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalProducts / pageSize)))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
