
import React, { useState, useEffect } from 'react';
import ProductGridHeader from './components/ProductGridHeader';
import ProductsDisplay from './components/ProductsDisplay';
import ProductPagination from './components/ProductPagination';
import { ProductProps } from './ProductCard';
import { fetchProducts } from '@/utils/apiUtils';
import { validateProductImages } from './utils/productValidator';

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
  // State for products and UI
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
  
  // Create a combined filters object
  const combinedFilters = {
    ...filters,
    brand: filteredBrand
  };
  
  // Fetch products
  const loadProducts = async () => {
    setIsLoading(true);
    
    try {
      const data = await fetchProducts(combinedFilters, currentPage, pageSize, sortOption);
      
      // Validate product images
      const validatedProducts = validateProductImages(data.products);
      
      setProducts(validatedProducts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load products when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentPage, sortOption, JSON.stringify(combinedFilters), pageSize]);
  
  // Reset to page 1 when filters or sort options change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [JSON.stringify(combinedFilters), sortOption, pageSize]);
  
  // Handle sort option change
  const handleSort = (option: string) => {
    setSortOption(option);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default React.memo(ProductGrid);
