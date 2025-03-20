
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductGridHeader from './components/ProductGridHeader';
import ProductPagination from './components/ProductPagination';
import { Product } from '@/types/api';
import { toast } from 'sonner';

interface ProductGridProps {
  gender?: string;
  brand?: string;
  category?: string;
  isNewIn?: boolean;
  isOnSale?: boolean;
  title?: string;
  filters?: Record<string, any>;
  pageSize?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  gender = '', 
  brand = '', 
  category = '', 
  isNewIn = false, 
  isOnSale = false,
  title,
  filters = {},
  pageSize = 8
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Function to build query parameters
  const buildQueryParams = () => {
    const urlParams = new URLSearchParams();
    
    // Add page navigation filters
    if (gender) urlParams.append('gender', gender);
    if (brand) urlParams.append('brand', brand);
    if (category) urlParams.append('category', category);
    if (isNewIn) urlParams.append('isNewIn', 'true');
    if (isOnSale) urlParams.append('isOnSale', 'true');
    
    // Add user-selected filters
    if (filters.brands && filters.brands.length > 0) {
      urlParams.append('brand', filters.brands.join(','));
    }
    
    if (filters.categories && filters.categories.length > 0) {
      urlParams.append('category', filters.categories.join(','));
    }
    
    if (filters.genders && filters.genders.length > 0) {
      urlParams.append('gender', filters.genders.join(','));
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
    
    if (filters.priceRange) {
      urlParams.append('minPrice', filters.priceRange.min.toString());
      urlParams.append('maxPrice', filters.priceRange.max.toString());
    }
    
    if (filters.caseSizeRange) {
      urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
      urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
    }
    
    // Add pagination and sorting
    urlParams.append('page', currentPage.toString());
    urlParams.append('pageSize', pageSize.toString());
    urlParams.append('sortBy', sortBy);
    
    return urlParams.toString();
  };

  // Fetch products with the current parameters
  const loadProducts = async () => {
    setLoading(true);
    
    const queryParams = buildQueryParams();
    console.log('Fetching products with params:', queryParams);
    
    try {
      // Direct API call to the edge function
      const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${queryParams}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch products:', response.status, response.statusText);
        setError('Failed to load products. Please try again later.');
        return;
      }
      
      const data = await response.json();
      console.log('Products data received:', data);
      
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
      toast.error('Failed to load products', {
        description: 'Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load products when dependencies change
  useEffect(() => {
    loadProducts();
  }, [gender, brand, category, isNewIn, isOnSale, currentPage, sortBy, JSON.stringify(filters)]);

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
        title={title}
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
