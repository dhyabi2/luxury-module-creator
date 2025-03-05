
import React from 'react';

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface ProductGridHeaderProps {
  title?: string;
  pagination: PaginationData;
  isLoading: boolean;
  sortOption: string;
  onSortChange: (option: string) => void;
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({
  title,
  pagination,
  isLoading,
  sortOption,
  onSortChange
}) => {
  return (
    <>
      {title && (
        <h2 className="text-2xl font-serif mb-4">{title}</h2>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b">
        <div className="text-sm text-gray-600 mb-3 md:mb-0">
          {pagination.totalCount > 0 ? (
            <>
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}–
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} items
            </>
          ) : (
            isLoading ? 'Loading products...' : 'No products found'
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select 
            className="text-sm border-gray-200 rounded-sm py-1 pr-8 pl-2 focus:border-brand focus:ring-0"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default ProductGridHeader;
