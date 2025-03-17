
import { useState, useRef, useCallback } from 'react';
import { ProductProps } from '../ProductCard';
import { usePagination } from './usePagination';
import { useRequestTracking } from './useRequestTracking';
import { useFetchDecision } from './useFetchDecision';

interface UseProductFetchStateResult {
  products: ProductProps[];
  isLoading: boolean;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  pendingRequest: React.MutableRefObject<AbortController | null>;
  lastFetchParams: string;
  isInitialRender: React.MutableRefObject<boolean>;
  setProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPagination: (pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }) => void;
  setLastFetchParams: React.Dispatch<React.SetStateAction<string>>;
  shouldFetch: (currentPage: number, sortOption: string, pageSize: number, filters: Record<string, any>) => boolean;
  lastFilters: React.MutableRefObject<Record<string, any>>;
  lastSort: React.MutableRefObject<string>;
  lastPage: React.MutableRefObject<number>;
  lastPageSize: React.MutableRefObject<number>;
}

/**
 * Hook for managing product fetching state
 * Consolidates all state management for product grid component
 * 
 * @param initialPageSize - Initial page size for pagination
 * @returns Object with all state and state setters
 */
export const useProductFetchState = (initialPageSize: number): UseProductFetchStateResult => {
  // Define useRef variables first to maintain consistent hook order
  const isInitialRender = useRef(true);
  
  // Then basic useState hooks
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchParams, setLastFetchParams] = useState('');
  
  // Delegate pagination state to a separate hook
  const { pagination, setPagination } = usePagination(initialPageSize);
  
  // Delegate request tracking to a separate hook
  const { pendingRequest, abortPendingRequest, createNewRequest } = useRequestTracking();
  
  // Delegate fetch decision logic to a separate hook
  const { shouldFetch, lastFilters, lastSort, lastPage, lastPageSize } = useFetchDecision(isInitialRender);
  
  // Add a reset function for easier state management
  const resetState = useCallback(() => {
    setProducts([]);
    setIsLoading(true);
    setLastFetchParams('');
    setPagination({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: initialPageSize
    });
    isInitialRender.current = true;
  }, [initialPageSize, setPagination]);

  return {
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
  };
};
