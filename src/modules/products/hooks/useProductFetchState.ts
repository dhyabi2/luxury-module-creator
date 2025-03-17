
import { useState, useRef } from 'react';
import { ProductProps } from '../ProductCard';
import { usePagination } from './usePagination';
import { useRequestTracking } from './useRequestTracking';
import { useFetchDecision } from './useFetchDecision';

export const useProductFetchState = (initialPageSize: number) => {
  // Basic state management
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchParams, setLastFetchParams] = useState('');
  const isInitialRender = useRef(true);
  
  // Delegate pagination state to a separate hook
  const { pagination, setPagination } = usePagination(initialPageSize);
  
  // Delegate request tracking to a separate hook
  const { pendingRequest } = useRequestTracking();
  
  // Delegate fetch decision logic to a separate hook
  const { shouldFetch } = useFetchDecision(isInitialRender);

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
    shouldFetch
  };
};
