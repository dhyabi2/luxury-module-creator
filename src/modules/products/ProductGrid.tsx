
import React, { useState, useEffect, useCallback } from 'react';
import { useProductFetching } from './hooks/useProductFetching';
import ProductGridHeader from './components/ProductGridHeader';
import ProductsDisplay from './components/ProductsDisplay';
import ProductPagination from './components/ProductPagination';

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
  const [sortOption, setSortOption] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Memoize the filter value to prevent reference changes when the object is the same
  const memoizedFilters = useCallback(() => {
    return filters;
  }, [JSON.stringify(filters)]); // Only update when stringified filters change
  
  // Reset to page 1 when filters or sort options change
  useEffect(() => {
    if (currentPage !== 1) {
      console.log('[ProductGrid] Resetting to page 1 due to filter/sort change');
      setCurrentPage(1);
    }
  }, [memoizedFilters(), sortOption, pageSize]); // Use memoized filters here
  
  const { products, isLoading, pagination } = useProductFetching({
    filteredBrand,
    filters: memoizedFilters(),
    pageSize,
    currentPage,
    sortOption
  });

  // Memoize the sort handler to prevent unnecessary rerenders
  const handleSort = useCallback((option: string) => {
    console.log(`[ProductGrid] Sort option changed to: ${option}`);
    setSortOption(option);
  }, []);
  
  // Memoize the page change handler
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
