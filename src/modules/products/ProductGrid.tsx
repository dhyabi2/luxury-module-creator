
import React, { useState, useEffect } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import { toast } from 'sonner';

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface ProductGridProps {
  title?: string;
  filteredBrand?: string;
  filters?: Record<string, any>;
  pageSize?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title = 'Products', 
  filteredBrand, 
  filters = {},
  pageSize = 8 
}) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: pageSize
  });
  
  // Fetch products directly from the API
  const fetchProducts = async () => {
    setIsLoading(true);
    
    try {
      // Build API URL with query parameters
      const urlParams = new URLSearchParams();
      
      // Priority to filteredBrand prop for backward compatibility
      if (filteredBrand) {
        urlParams.append('brand', filteredBrand);
      } else if (filters.brands && filters.brands.length > 0) {
        urlParams.append('brand', filters.brands.join(','));
      }
      
      // Add other filters
      if (filters.categories && filters.categories.length > 0) {
        urlParams.append('category', filters.categories.join(','));
      }
      
      if (filters.bands && filters.bands.length > 0) {
        urlParams.append('band', filters.bands.join(','));
      }
      
      if (filters.caseColors && filters.caseColors.length > 0) {
        urlParams.append('caseColor', filters.caseColors.join(','));
      }
      
      if (filters.colors && filters.colors.length > 0) {
        urlParams.append('color', filters.colors.join(','));
      }
      
      // Add price range if present
      if (filters.priceRange) {
        urlParams.append('minPrice', filters.priceRange.min.toString());
        urlParams.append('maxPrice', filters.priceRange.max.toString());
      }
      
      // Add case size range if present
      if (filters.caseSizeRange) {
        urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
        urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
      }
      
      // Add pagination and sorting
      urlParams.append('page', currentPage.toString());
      urlParams.append('pageSize', pageSize.toString());
      urlParams.append('sortBy', sortOption);
      
      console.log(`Fetching products: /api/products?${urlParams.toString()}`);
      
      // Direct API call without hooks or middleware
      const response = await fetch(`/api/products?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Products data received:', data);
      
      // Update state with fetched data
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.log('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
      setProducts([]);
      setPagination({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: pageSize
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch products when component mounts or dependencies change
  useEffect(() => {
    fetchProducts();
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, pageSize, sortOption]);
  
  // Fetch when page changes (separate dependency to avoid double-fetching)
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleSort = (option: string) => {
    setSortOption(option);
    // Products will be fetched with the new sort option via the useEffect
  };
  
  return (
    <div>
      {title && (
        <h2 className="text-2xl font-serif mb-4">{title}</h2>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b">
        <div className="text-sm text-gray-600 mb-3 md:mb-0">
          {pagination.totalCount > 0 ? (
            <>
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}–
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} items
            </>
          ) : (
            isLoading ? 'Loading products...' : 'No products found'
          )}
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="opacity-0 animate-fade-in" 
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards' 
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products match your selected filters.</p>
          <button 
            className="mt-4 text-brand hover:underline"
            onClick={() => window.location.reload()}
          >
            Clear filters and try again
          </button>
        </div>
      )}
      
      {/* Pagination - only show if we have products */}
      {pagination.totalPages > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-1 text-sm">
            <button 
              className="px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => (
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
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
