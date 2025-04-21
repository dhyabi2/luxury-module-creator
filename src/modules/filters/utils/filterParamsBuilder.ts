
interface FilterParams {
  selectedOptions?: Record<string, string[]>;
  priceRange?: { min: number; max: number };
  categoryParam?: string;
}

export const buildFilterParams = (filters: FilterParams = {}) => {
  const params = new URLSearchParams();
  
  // Add category parameter
  if (filters.categoryParam) {
    params.append('category', filters.categoryParam);
  }
  
  // Add selected options parameters
  if (filters.selectedOptions) {
    if (filters.selectedOptions.brands?.length > 0) {
      params.append('brand', filters.selectedOptions.brands.join(','));
    }
    
    if (filters.selectedOptions.categories?.length > 0) {
      params.append('category', filters.selectedOptions.categories.join(','));
    }
    
    if (filters.selectedOptions.genders?.length > 0) {
      params.append('gender', filters.selectedOptions.genders.join(','));
    }
    
    if (filters.selectedOptions.instock?.includes('instock')) {
      params.append('instock', 'true');
    }
    
    if (filters.selectedOptions.clearance?.includes('clearance')) {
      params.append('clearance', 'true');
    }
  }
  
  // Add price range parameters
  if (filters.priceRange) {
    params.append('minPrice', filters.priceRange.min.toString());
    params.append('maxPrice', filters.priceRange.max.toString());
  }
  
  return params;
};
