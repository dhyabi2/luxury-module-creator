
import { useCallback } from 'react';

interface BuildQueryParamsProps {
  filteredBrand?: string;
  filters: Record<string, any>;
  pageSize: number;
}

export const useQueryParamsBuilder = ({ filteredBrand, filters, pageSize }: BuildQueryParamsProps) => {
  const buildQueryParams = useCallback((page: number, sort: string, filterValues: Record<string, any>) => {
    const urlParams = new URLSearchParams();
    
    if (filteredBrand) {
      console.log(`[ProductGrid] Using filteredBrand: ${filteredBrand}`);
      urlParams.append('brand', filteredBrand);
    } else if (filterValues.brands && filterValues.brands.length > 0) {
      console.log(`[ProductGrid] Using brands filter: ${filterValues.brands.join(',')}`);
      urlParams.append('brand', filterValues.brands.join(','));
    }
    
    if (filterValues.categories && filterValues.categories.length > 0) {
      console.log(`[ProductGrid] Using categories filter: ${filterValues.categories.join(',')}`);
      urlParams.append('category', filterValues.categories.join(','));
    }
    
    if (filterValues.genders && filterValues.genders.length > 0) {
      console.log(`[ProductGrid] Using genders filter: ${filterValues.genders.join(',')}`);
      urlParams.append('gender', filterValues.genders.join(','));
    }
    
    if (filterValues.bands && filterValues.bands.length > 0) {
      console.log(`[ProductGrid] Using bands filter: ${filterValues.bands.join(',')}`);
      urlParams.append('band', filterValues.bands.join(','));
    }
    
    if (filterValues.caseColors && filterValues.caseColors.length > 0) {
      console.log(`[ProductGrid] Using caseColors filter: ${filterValues.caseColors.join(',')}`);
      urlParams.append('caseColor', filterValues.caseColors.join(','));
    }
    
    if (filterValues.colors && filterValues.colors.length > 0) {
      console.log(`[ProductGrid] Using colors filter: ${filterValues.colors.join(',')}`);
      urlParams.append('color', filterValues.colors.join(','));
    }
    
    if (filterValues.priceRange) {
      console.log(`[ProductGrid] Using price range: ${filterValues.priceRange.min}-${filterValues.priceRange.max}`);
      urlParams.append('minPrice', filterValues.priceRange.min.toString());
      urlParams.append('maxPrice', filterValues.priceRange.max.toString());
    }
    
    if (filterValues.caseSizeRange) {
      console.log(`[ProductGrid] Using case size range: ${filterValues.caseSizeRange.min}-${filterValues.caseSizeRange.max}`);
      urlParams.append('minCaseSize', filterValues.caseSizeRange.min.toString());
      urlParams.append('maxCaseSize', filterValues.caseSizeRange.max.toString());
    }
    
    urlParams.append('page', page.toString());
    urlParams.append('pageSize', pageSize.toString());
    urlParams.append('sortBy', sort);
    
    return urlParams.toString();
  }, [filteredBrand, pageSize]);

  return { buildQueryParams };
};
