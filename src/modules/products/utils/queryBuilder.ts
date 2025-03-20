
/**
 * Utility to build query parameters for product API requests
 */

export const buildQueryParams = (
  gender: string = '',
  brand: string = '',
  category: string = '',
  isNewIn: boolean = false,
  isOnSale: boolean = false,
  filters: Record<string, any> = {},
  currentPage: number = 1,
  sortBy: string = 'featured',
  pageSize: number = 8
): string => {
  const urlParams = new URLSearchParams();
  
  // Add page navigation filters
  if (gender) urlParams.append('gender', gender);
  if (brand) urlParams.append('brand', brand);
  if (category) urlParams.append('category', category);
  if (isNewIn) urlParams.append('isNewIn', 'true');
  if (isOnSale) urlParams.append('isOnSale', 'true');
  
  // Add user-selected filters
  if (filters.brands && filters.brands.length > 0) {
    urlParams.append('brand', filters.brands.join(','));
  }
  
  if (filters.categories && filters.categories.length > 0) {
    urlParams.append('category', filters.categories.join(','));
  }
  
  if (filters.genders && filters.genders.length > 0) {
    urlParams.append('gender', filters.genders.join(','));
  }
  
  if (filters.bands && filters.bands.length > 0) {
    urlParams.append('band', filters.bands.join(','));
  }
  
  if (filters.caseColors && filters.caseColors.length > 0) {
    urlParams.append('caseColor', filters.caseColors.join(','));
  }
  
  if (filters.colors && filters.colors.length > 0) {
    urlParams.append('color', filters.colors.join(','));
  }
  
  if (filters.priceRange) {
    urlParams.append('minPrice', filters.priceRange.min.toString());
    urlParams.append('maxPrice', filters.priceRange.max.toString());
  }
  
  if (filters.caseSizeRange) {
    urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
    urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
  }
  
  // Add pagination and sorting
  urlParams.append('page', currentPage.toString());
  urlParams.append('pageSize', pageSize.toString());
  urlParams.append('sortBy', sortBy);
  
  return urlParams.toString();
};
