
import React, { useState, useEffect } from 'react';
import ProductGridHeader from './components/ProductGridHeader';
import ProductGridLoading from './components/ProductGridLoading';
import ProductGridEmpty from './components/ProductGridEmpty';
import ProductGridContent from './components/ProductGridContent';
import { buildQueryParams } from './utils/queryBuilder';
import { fetchProducts } from './services/productService';
import { Product } from '@/types/api';

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

  // Load products when dependencies change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      
      const queryParams = buildQueryParams(
        gender, 
        brand, 
        category, 
        isNewIn, 
        isOnSale, 
        filters, 
        currentPage, 
        sortBy, 
        pageSize
      );
      
      console.log('Fetching products with query params:', queryParams);
      const data = await fetchProducts(queryParams);
      
      if (data) {
        console.log('Product data received:', data);
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setCurrentPage(data.pagination.currentPage);
        setError(null);
      } else {
        console.error('Failed to load products - no data returned');
        setError('Failed to load products');
      }
      
      setLoading(false);
    };
    
    loadProducts();
  }, [gender, brand, category, isNewIn, isOnSale, currentPage, sortBy, JSON.stringify(filters), pageSize]);

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
    return <ProductGridLoading sortBy={sortBy} onSortChange={handleSortChange} />;
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
        <ProductGridEmpty />
      ) : (
        <ProductGridContent 
          products={products}
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductGrid;
