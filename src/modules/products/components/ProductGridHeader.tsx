
import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface ProductGridHeaderProps {
  title?: string;
  totalProducts: number;
  sortBy: string;
  onSortChange: (sortValue: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({
  title,
  totalProducts,
  sortBy,
  onSortChange,
  loading = false,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b">
      <div>
        {title && (
          <h2 className="text-lg font-medium mb-1">{title}</h2>
        )}
        <p className="text-sm text-gray-500">
          {loading ? (
            <span className="inline-flex items-center">
              <span className="animate-pulse">Loading products...</span>
            </span>
          ) : (
            <span>
              Showing <span className="font-medium">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh products"
            disabled={loading}
          >
            <RefreshCcw 
              size={18} 
              className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} 
            />
          </button>
        )}
        
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>
    </div>
  );
};

export default ProductGridHeader;
