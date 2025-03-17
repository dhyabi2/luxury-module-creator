
import { useState } from 'react';

export interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const usePagination = (initialPageSize: number) => {
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: initialPageSize
  });

  return {
    pagination,
    setPagination
  };
};
