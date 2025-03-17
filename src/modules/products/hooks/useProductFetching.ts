
import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { useQueryParamsBuilder } from './useQueryParamsBuilder';
import { useProductCache } from './useProductCache';
import { useProductFetchState } from './useProductFetchState';
import { validateProductImages } from '../utils/productValidator';

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
  // Use our smaller hooks
  const { buildQueryParams } = useQueryParamsBuilder({ filteredBrand, filters, pageSize });
  const { getCachedResponse, cacheResponse } = useProductCache();
  const {
    products,
    isLoading,
    pagination,
    pendingRequest,
    lastFetchParams,
    isInitialRender,
    setProducts,
    setIsLoading,
    setPagination,
    setLastFetchParams,
    shouldFetch,
    lastFilters,
    lastSort,
    lastPage,
    lastPageSize
  } = useProductFetchState(pageSize);

  const fetchProducts = useCallback(async () => {
    if (!shouldFetch(currentPage, sortOption, pageSize, filters)) {
      console.log('[ProductGrid] Skipping fetch - no relevant parameters changed');
      setIsLoading(false);
      return;
    }
    
    console.log('[ProductGrid] Starting products fetch');
    
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
      
      const cachedResponse = getCachedResponse(queryString);
      if (cachedResponse) {
        console.log('[ProductGrid] Using cached response');
        setProducts(cachedResponse.products);
        setPagination(cachedResponse.pagination);
        setIsLoading(false);
        isInitialRender.current = false;
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
      
      // Validate product images only once after fetching
      const validatedProducts = validateProductImages(data.products);
      
      setProducts(validatedProducts);
      setPagination(data.pagination);
      
      cacheResponse(queryString, {
        products: validatedProducts,
        pagination: data.pagination
      });
      
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
  }, [
    currentPage, 
    filters, 
    buildQueryParams, 
    sortOption, 
    lastFetchParams, 
    products.length, 
    pageSize, 
    shouldFetch, 
    getCachedResponse, 
    cacheResponse,
    setIsLoading,
    setLastFetchParams,
    setProducts,
    setPagination
  ]);
  
  const debouncedFetchProducts = useCallback(
    debounce(() => {
      console.log('[ProductGrid] Executing debounced fetch');
      fetchProducts();
    }, 500),
    [fetchProducts]
  );

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
  }, [currentPage, fetchProducts, lastPage]);

  return {
    products,
    isLoading,
    pagination
  };
};
