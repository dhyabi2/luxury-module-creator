
import React from 'react';

interface ProductGridHeaderProps {
  title?: string;
  totalProducts: number;
  loading: boolean;
  sortBy: string;
  onSortChange: (option: string) => void;
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({
  title,
  totalProducts,
  loading,
  sortBy,
  onSortChange
}) => {
  return (
    <>
      {title && (
        <h2 className="text-2xl font-serif mb-4">{title}</h2>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b">
        <div className="text-sm text-gray-600 mb-3 md:mb-0">
          {totalProducts > 0 ? (
            <>
              Showing products from total of {totalProducts} items
            </>
          ) : (
            loading ? 'Loading products...' : 'No products found'
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select 
            className="text-sm border-gray-200 rounded-sm py-1 pr-8 pl-2 focus:border-brand focus:ring-0"
            value={sortBy}
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
