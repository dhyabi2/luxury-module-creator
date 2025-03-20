
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductGridHeader from './components/ProductGridHeader';
import ProductPagination from './components/ProductPagination';
import { fetchProducts } from '@/utils/apiUtils';
import { Product } from '@/types/api';
import { toast } from 'sonner';

interface ProductGridProps {
  gender?: string;
  brand?: string;
  category?: string;
  isNewIn?: boolean;
  isOnSale?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  gender = '', 
  brand = '', 
  category = '', 
  isNewIn = false, 
  isOnSale = false 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const pageSize = 8;
  
  // Use a ref to track active requests for cleanup
  const pendingRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    // Function to fetch products
    const loadProducts = async () => {
      // If there's a pending request, cancel it
      if (pendingRequest.current) {
        pendingRequest.current.abort();
      }
      
      // Create a new abort controller for this request
      pendingRequest.current = new AbortController();
      setLoading(true);
      
      try {
        const response = await fetchProducts({
          gender,
          brand,
          category,
          isNewIn,
          isOnSale,
          page: currentPage,
          pageSize,
          sortBy
        });
        
        setProducts(response.products);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } catch (err) {
        // Only handle errors that aren't from aborting
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error loading products:', err);
          setError('Failed to load products. Please try again later.');
          toast.error('Failed to load products', {
            description: 'Please try again later.',
            duration: 3000
          });
        }
      } finally {
        setLoading(false);
        pendingRequest.current = null;
      }
    };

    loadProducts();
    
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (pendingRequest.current) {
        pendingRequest.current.abort();
      }
    };
  }, [gender, brand, category, isNewIn, isOnSale, currentPage, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-4">
        <ProductGridHeader
          totalProducts={0}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          loading={true}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <ProductGridHeader
        totalProducts={totalCount}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        loading={loading}
      />
      
      {products.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p>No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductGrid;
