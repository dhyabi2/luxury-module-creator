
import { useState, useRef, useCallback } from 'react';
import { ProductProps } from '../ProductCard';

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface UseProductFetchStateResult {
  products: ProductProps[];
  isLoading: boolean;
  pagination: PaginationData;
  pendingRequest: React.MutableRefObject<AbortController | null>;
  lastFetchParams: string;
  isInitialRender: React.MutableRefObject<boolean>;
  setProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationData>>;
  setLastFetchParams: React.Dispatch<React.SetStateAction<string>>;
  shouldFetch: (currentPage: number, sortOption: string, pageSize: number, filters: Record<string, any>) => boolean;
}

export const useProductFetchState = (initialPageSize: number): UseProductFetchStateResult => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: initialPageSize
  });
  const [lastFetchParams, setLastFetchParams] = useState('');
  const isInitialRender = useRef(true);
  const pendingRequest = useRef<AbortController | null>(null);
  const lastFilters = useRef<Record<string, any>>({});
  const lastSort = useRef('');
  const lastPage = useRef(1);
  const lastPageSize = useRef(initialPageSize);

  const shouldFetch = useCallback((currentPage: number, sortOption: string, pageSize: number, filters: Record<string, any>) => {
    if (isInitialRender.current) return true;
    
    if (
      lastPage.current !== currentPage ||
      lastSort.current !== sortOption ||
      lastPageSize.current !== pageSize ||
      JSON.stringify(lastFilters.current) !== JSON.stringify(filters)
    ) {
      return true;
    }
    
    return false;
  }, []);

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
