
import { useCallback, useRef } from 'react';

export const useFetchDecision = (isInitialRender: React.MutableRefObject<boolean>) => {
  const lastFilters = useRef<Record<string, any>>({});
  const lastSort = useRef('');
  const lastPage = useRef(1);
  const lastPageSize = useRef(0);

  const shouldFetch = useCallback((currentPage: number, sortOption: string, pageSize: number, filters: Record<string, any>) => {
    if (isInitialRender.current) return true;
    
    if (
      lastPage.current !== currentPage ||
      lastSort.current !== sortOption ||
      lastPageSize.current !== pageSize ||
      JSON.stringify(lastFilters.current) !== JSON.stringify(filters)
    ) {
      // Update the last known values
      lastPage.current = currentPage;
      lastSort.current = sortOption;
      lastPageSize.current = pageSize;
      lastFilters.current = { ...filters };
      return true;
    }
    
    return false;
  }, [isInitialRender]);

  return {
    shouldFetch,
    lastFilters,
    lastSort,
    lastPage,
    lastPageSize
  };
};
