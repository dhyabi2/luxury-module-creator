
import React, { useState, useEffect, useCallback } from 'react';
import ProductGridHeader from './components/ProductGridHeader';
import ProductsDisplay from './components/ProductsDisplay';
import ProductPagination from './components/ProductPagination';
import { ProductProps } from './ProductCard';

interface ProductGridProps {
  title?: string;
  filteredBrand?: string;
  filters?: Record<string, any>;
  pageSize?: number;
}

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title = 'Products', 
  filteredBrand, 
  filters = {},
  pageSize = 8 
}) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize
  });
  
  // Build query parameters for API request
  const buildQueryParams = (page: number, sort: string, filterValues: Record<string, any>) => {
    const urlParams = new URLSearchParams();
    
    if (filteredBrand) {
      console.log(`[ProductGrid] Using filteredBrand: ${filteredBrand}`);
      urlParams.append('brand', filteredBrand);
    } else if (filterValues.brands && filterValues.brands.length > 0) {
      console.log(`[ProductGrid] Using brands filter: ${filterValues.brands.join(',')}`);
      urlParams.append('brand', filterValues.brands.join(','));
    }
    
    if (filterValues.categories && filterValues.categories.length > 0) {
      console.log(`[ProductGrid] Using categories filter: ${filterValues.categories.join(',')}`);
      urlParams.append('category', filterValues.categories.join(','));
    }
    
    if (filterValues.genders && filterValues.genders.length > 0) {
      console.log(`[ProductGrid] Using genders filter: ${filterValues.genders.join(',')}`);
      urlParams.append('gender', filterValues.genders.join(','));
    }
    
    if (filterValues.bands && filterValues.bands.length > 0) {
      console.log(`[ProductGrid] Using bands filter: ${filterValues.bands.join(',')}`);
      urlParams.append('band', filterValues.bands.join(','));
    }
    
    if (filterValues.caseColors && filterValues.caseColors.length > 0) {
      console.log(`[ProductGrid] Using caseColors filter: ${filterValues.caseColors.join(',')}`);
      urlParams.append('caseColor', filterValues.caseColors.join(','));
    }
    
    if (filterValues.colors && filterValues.colors.length > 0) {
      console.log(`[ProductGrid] Using colors filter: ${filterValues.colors.join(',')}`);
      urlParams.append('color', filterValues.colors.join(','));
    }
    
    if (filterValues.priceRange) {
      console.log(`[ProductGrid] Using price range: ${filterValues.priceRange.min}-${filterValues.priceRange.max}`);
      urlParams.append('minPrice', filterValues.priceRange.min.toString());
      urlParams.append('maxPrice', filterValues.priceRange.max.toString());
    }
    
    if (filterValues.caseSizeRange) {
      console.log(`[ProductGrid] Using case size range: ${filterValues.caseSizeRange.min}-${filterValues.caseSizeRange.max}`);
      urlParams.append('minCaseSize', filterValues.caseSizeRange.min.toString());
      urlParams.append('maxCaseSize', filterValues.caseSizeRange.max.toString());
    }
    
    urlParams.append('page', page.toString());
    urlParams.append('pageSize', pageSize.toString());
    urlParams.append('sortBy', sort);
    
    return urlParams.toString();
  };
  
  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    
    const queryString = buildQueryParams(currentPage, sortOption, filters);
    console.log(`[ProductGrid] Fetching products: /api/products?${queryString}`);
    
    try {
      const response = await fetch(`/api/products?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`[ProductGrid] Products data received: ${data.products.length} products, total: ${data.pagination.totalCount}`);
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('[ProductGrid] Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortOption, filters, pageSize, filteredBrand]);
  
  // Reset to page 1 when filters or sort options change
  useEffect(() => {
    if (currentPage !== 1) {
      console.log('[ProductGrid] Resetting to page 1 due to filter/sort change');
      setCurrentPage(1);
    }
  }, [JSON.stringify(filters), sortOption, pageSize]);
  
  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Handle sort option change
  const handleSort = useCallback((option: string) => {
    console.log(`[ProductGrid] Sort option changed to: ${option}`);
    setSortOption(option);
  }, []);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  return (
    <div>
      <ProductGridHeader 
        title={title}
        pagination={pagination}
        isLoading={isLoading}
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      <ProductsDisplay 
        products={products}
        isLoading={isLoading}
        pageSize={pageSize}
      />
      
      <ProductPagination 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default React.memo(ProductGrid);
