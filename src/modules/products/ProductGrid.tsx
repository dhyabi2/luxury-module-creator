
import React, { useState, useEffect } from 'react';
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
  
  // Reset to page 1 when filters or sort options change
  useEffect(() => {
    if (currentPage !== 1) {
      console.log('[ProductGrid] Resetting to page 1 due to filter/sort change');
      setCurrentPage(1);
    }
  }, [filters, sortOption, pageSize, currentPage]);
  
  const { products, isLoading, pagination } = useProductFetching({
    filteredBrand,
    filters,
    pageSize,
    currentPage,
    sortOption
  });

  const handleSort = (option: string) => {
    console.log(`[ProductGrid] Sort option changed to: ${option}`);
    setSortOption(option);
  };
  
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
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductGrid;
