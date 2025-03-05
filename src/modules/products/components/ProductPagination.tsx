
import React from 'react';

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface ProductPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  pagination,
  onPageChange
}) => {
  if (pagination.totalPages <= 0) {
    return null;
  }
  
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-1 text-sm">
        <button 
          className="px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100"
          disabled={pagination.currentPage === 1}
          onClick={() => onPageChange(Math.max(pagination.currentPage - 1, 1))}
        >
          Previous
        </button>
        
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => (
          <button 
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-sm ${
              pagination.currentPage === i + 1 
                ? 'bg-brand text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        
        <button 
          className="px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:hover:bg-gray-100"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductPagination;
