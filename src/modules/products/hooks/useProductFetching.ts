
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { ProductProps } from '../ProductCard';

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface UseProductFetchingProps {
  filteredBrand?: string;
  filters: Record<string, any>;
  pageSize: number;
  currentPage: number;
  sortOption: string;
}

export const useProductFetching = ({
  filteredBrand,
  filters,
  pageSize,
  currentPage,
  sortOption
}: UseProductFetchingProps) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: pageSize
  });
  const [lastFetchParams, setLastFetchParams] = useState('');
  const isInitialRender = useRef(true);
  const pendingRequest = useRef<AbortController | null>(null);
  const lastFilters = useRef(filters);
  const lastSort = useRef(sortOption);
  const lastPage = useRef(currentPage);
  const lastPageSize = useRef(pageSize);

  // Memoize the buildQueryParams function to prevent recreation on each render
  const buildQueryParams = useCallback((page: number, sort: string, filterValues: Record<string, any>) => {
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
  }, [filteredBrand, pageSize]);
  
  // Skip fetch if filters haven't changed
  const shouldFetch = useCallback(() => {
    // Always fetch on initial render
    if (isInitialRender.current) return true;
    
    // Check if any major params have changed
    if (
      lastPage.current !== currentPage ||
      lastSort.current !== sortOption ||
      lastPageSize.current !== pageSize ||
      JSON.stringify(lastFilters.current) !== JSON.stringify(filters)
    ) {
      return true;
    }
    
    return false;
  }, [currentPage, filters, sortOption, pageSize]);
  
  const fetchProducts = useCallback(async () => {
    // Skip fetch if nothing has changed
    if (!shouldFetch()) {
      console.log('[ProductGrid] Skipping fetch - no relevant parameters changed');
      setIsLoading(false);
      return;
    }
    
    console.log('[ProductGrid] Starting products fetch');
    
    // Store current values in refs for future comparison
    lastFilters.current = filters;
    lastSort.current = sortOption;
    lastPage.current = currentPage;
    lastPageSize.current = pageSize;
    
    if (pendingRequest.current) {
      pendingRequest.current.abort();
      console.log('[ProductGrid] Cancelled previous fetch request');
    }
    
    pendingRequest.current = new AbortController();
    setIsLoading(true);
    
    try {
      const queryString = buildQueryParams(currentPage, sortOption, filters);
      
      if (queryString === lastFetchParams && products.length > 0 && !isInitialRender.current) {
        console.log('[ProductGrid] Skipping fetch - parameters unchanged and products exist');
        setIsLoading(false);
        return;
      }
      
      console.log(`[ProductGrid] Fetching products: /api/products?${queryString}`);
      setLastFetchParams(queryString);
      
      const response = await fetch(`/api/products?${queryString}`, {
        signal: pendingRequest.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`[ProductGrid] Products data received: ${data.products.length} products, total: ${data.pagination.totalCount}`);
      
      setProducts(data.products);
      setPagination(data.pagination);
      isInitialRender.current = false;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('[ProductGrid] Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
        setProducts([]);
        setPagination({
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: pageSize
        });
      }
    } finally {
      console.log('[ProductGrid] Products fetch completed');
      setIsLoading(false);
      pendingRequest.current = null;
    }
  }, [currentPage, filters, buildQueryParams, sortOption, lastFetchParams, products.length, pageSize, shouldFetch]);
  
  // Use a properly memoized debounce that won't recreate on every render
  // This helps prevent multiple requests when filters change frequently
  const debouncedFetchProducts = useCallback(
    debounce(() => {
      console.log('[ProductGrid] Executing debounced fetch');
      fetchProducts();
    }, 300),
    [fetchProducts]
  );

  // Effect for filters or sort option changes
  useEffect(() => {
    console.log('[ProductGrid] Filters or sort options changed');
    console.log('[ProductGrid] Initiating debounced fetch due to filter/sort change');
    debouncedFetchProducts();
    return () => {
      console.log('[ProductGrid] Cleanup - cancelling debounced fetch');
      debouncedFetchProducts.cancel();
      
      if (pendingRequest.current) {
        pendingRequest.current.abort();
      }
    };
  }, [filters, sortOption, pageSize, debouncedFetchProducts]);
  
  // Only use immediate fetch for page changes (not debounced)
  useEffect(() => {
    if (currentPage !== lastPage.current) {
      console.log(`[ProductGrid] Page changed to ${currentPage}, initiating fetch`);
      fetchProducts();
    }
    
    return () => {
      if (pendingRequest.current) {
        pendingRequest.current.abort();
      }
    };
  }, [currentPage, fetchProducts]);

  return {
    products,
    isLoading,
    pagination
  };
};
