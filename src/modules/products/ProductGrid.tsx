
import React, { useState, useEffect } from 'react';
import ProductGridHeader from './components/ProductGridHeader';
import ProductGridLoading from './components/ProductGridLoading';
import ProductGridEmpty from './components/ProductGridEmpty';
import ProductGridContent from './components/ProductGridContent';
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

  // Function to directly call the filter-products edge function
  const loadProducts = async () => {
    setLoading(true);
    console.log('Loading products with filters:', filters);
    
    // Prepare URL parameters
    const urlParams = new URLSearchParams();
    
    // Add basic filters
    if (gender) urlParams.append('gender', gender);
    if (brand) urlParams.append('brand', brand);
    if (category) urlParams.append('category', category);
    if (isNewIn) urlParams.append('newArrival', 'true');
    if (isOnSale) urlParams.append('onSale', 'true');
    
    // Add filter selections
    if (filters.selectedOptions?.brands?.length > 0 && !filters.selectedOptions.brands.includes('all')) {
      urlParams.append('brand', filters.selectedOptions.brands.join(','));
      console.log('Filtering by brands:', filters.selectedOptions.brands.join(','));
    }
    
    if (filters.selectedOptions?.categories?.length > 0 && !filters.selectedOptions.categories.includes('all')) {
      urlParams.append('category', filters.selectedOptions.categories.join(','));
      console.log('Filtering by categories:', filters.selectedOptions.categories.join(','));
    }
    
    if (filters.selectedOptions?.genders?.length > 0 && !filters.selectedOptions.genders.includes('all')) {
      urlParams.append('gender', filters.selectedOptions.genders.join(','));
      console.log('Filtering by genders:', filters.selectedOptions.genders.join(','));
    }
    
    if (filters.selectedOptions?.bands?.length > 0 && !filters.selectedOptions.bands.includes('all')) {
      urlParams.append('band', filters.selectedOptions.bands.join(','));
      console.log('Filtering by bands:', filters.selectedOptions.bands.join(','));
    }
    
    if (filters.selectedOptions?.caseColors?.length > 0 && !filters.selectedOptions.caseColors.includes('all')) {
      urlParams.append('caseColor', filters.selectedOptions.caseColors.join(','));
      console.log('Filtering by case colors:', filters.selectedOptions.caseColors.join(','));
    }
    
    if (filters.selectedOptions?.colors?.length > 0 && !filters.selectedOptions.colors.includes('all')) {
      urlParams.append('color', filters.selectedOptions.colors.join(','));
      console.log('Filtering by colors:', filters.selectedOptions.colors.join(','));
    }
    
    // Add range filters
    if (filters.priceRange) {
      urlParams.append('minPrice', filters.priceRange.min.toString());
      urlParams.append('maxPrice', filters.priceRange.max.toString());
      console.log('Filtering by price range:', `${filters.priceRange.min}-${filters.priceRange.max}`);
    }
    
    const hasWatchesCategory = 
      (filters.selectedOptions?.categories?.includes('watches')) || 
      (category && category.toLowerCase() === 'watches');

    if (filters.caseSizeRange && hasWatchesCategory) {
      urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
      urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
      console.log('Filtering by case size range:', `${filters.caseSizeRange.min}-${filters.caseSizeRange.max}`);
    }
    
    // Add boolean filters
    if (filters.selectedOptions?.clearance?.length > 0) {
      urlParams.append('clearance', 'true');
      console.log('Filtering by clearance items');
    }
    
    if (filters.selectedOptions?.instock?.length > 0) {
      urlParams.append('instock', 'true');
      console.log('Filtering by in stock items');
    }
    
    // Add pagination and sorting
    urlParams.append('page', currentPage.toString());
    urlParams.append('pageSize', pageSize.toString());
    urlParams.append('sortBy', sortBy);
    
    const queryString = urlParams.toString();
    console.log('Final query string:', queryString);
    
    try {
      console.log('Fetching products with query params:', queryString);
      
      // Make direct API call to the edge function
      const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
      
      // Prepare filter data for the request body
      const filterData = {
        gender,
        brand,
        category,
        newArrival: isNewIn ? 'true' : undefined,
        onSale: isOnSale ? 'true' : undefined,
        brands: filters.selectedOptions?.brands?.join(','),
        categories: filters.selectedOptions?.categories?.join(','),
        genders: filters.selectedOptions?.genders?.join(','),
        bands: filters.selectedOptions?.bands?.join(','),
        caseColors: filters.selectedOptions?.caseColors?.join(','),
        colors: filters.selectedOptions?.colors?.join(','),
        minPrice: filters.priceRange?.min,
        maxPrice: filters.priceRange?.max,
        minCaseSize: filters.caseSizeRange?.min,
        maxCaseSize: filters.caseSizeRange?.max,
        instock: filters.selectedOptions?.instock?.includes('true') ? 'true' : undefined,
        clearance: filters.selectedOptions?.clearance?.includes('true') ? 'true' : undefined,
        page: currentPage,
        pageSize,
        sortBy
      };
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/filter-products?${queryString}`, {
        method: 'POST',
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filterData)
      });
      
      if (!response.ok) {
        console.error('Failed to fetch products:', response.status, response.statusText);
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Product data received:', data);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setCurrentPage(data.pagination.currentPage);
      setError(null);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load products when filters, pagination, or sorting changes
  useEffect(() => {
    loadProducts();
  }, [gender, brand, category, isNewIn, isOnSale, currentPage, sortBy, JSON.stringify(filters), pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    loadProducts();
    toast.success('Refreshing products');
  };

  if (loading && products.length === 0) {
    return <ProductGridLoading sortBy={sortBy} onSortChange={handleSortChange} />;
  }

  return (
    <div className="space-y-4">
      <ProductGridHeader
        title={title}
        totalProducts={totalCount}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        loading={loading}
        onRefresh={handleRefresh}
      />
      
      {products.length === 0 && !loading ? (
        <ProductGridEmpty />
      ) : (
        <ProductGridContent 
          products={products}
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
          <button 
            onClick={handleRefresh} 
            className="ml-2 underline text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
