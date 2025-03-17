
import { useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { useQueryParamsBuilder } from './useQueryParamsBuilder';
import { useProductCache } from './useProductCache';
import { useProductFetchState } from './useProductFetchState';

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
    shouldFetch
  } = useProductFetchState(pageSize);

  // Refs to track changes
  const lastFilters = useRef(filters);
  const lastSort = useRef(sortOption);
  const lastPage = useRef(currentPage);
  const lastPageSize = useRef(pageSize);

  const validateProducts = useCallback((productsData: any[]) => {
    return productsData.map((product) => {
      const validImageUrl = product.imageUrl && typeof product.imageUrl === 'string' && 
        (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://'));
      
      if (!validImageUrl) {
        console.log(`[ProductGrid] Fixing invalid image URL for product: ${product.id}`);
        return {
          ...product,
          imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format'
        };
      }
      return product;
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!shouldFetch(currentPage, sortOption, pageSize, filters)) {
      console.log('[ProductGrid] Skipping fetch - no relevant parameters changed');
      setIsLoading(false);
      return;
    }
    
    console.log('[ProductGrid] Starting products fetch');
    
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
      
      const validatedProducts = validateProducts(data.products);
      
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
    validateProducts,
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
  }, [currentPage, fetchProducts]);

  return {
    products,
    isLoading,
    pagination
  };
};
