
// Main filters module - exports all filter functions
import { applyBrandFilter } from './brandFilter';
import { applyCategoryFilter } from './categoryFilter';
import { applyGenderFilter } from './genderFilter';
import { applyPriceFilter } from './priceFilter';
import { 
  applyCaseSizeFilter, 
  applyBandFilter, 
  applyCaseColorFilter, 
  applyColorFilter 
} from './watchFilters';
import { applySpecialFilters } from './specialFilters';

// Apply all filters to a query
export const applyAllFilters = (query: any, params: any) => {
  console.log('[API:products] Building Supabase query with filters:', params);
  
  query = applyBrandFilter(query, params);
  query = applyCategoryFilter(query, params);
  query = applyPriceFilter(query, params);
  
  // Check for watch-specific category
  const isWatchCategory = params.category && params.category.includes('watches');
  const isNonWatchCategory = params.category && 
    (params.category.toLowerCase().includes('accessories') || 
     params.category.toLowerCase().includes('bags') || 
     params.category.toLowerCase().includes('perfumes'));
       
  if (isWatchCategory || !isNonWatchCategory) {
    console.log('[API:products] Applying watch-specific filters');
    query = applyCaseSizeFilter(query, params);
    query = applyBandFilter(query, params);
    query = applyCaseColorFilter(query, params);
    query = applyColorFilter(query, params);
  } else {
    console.log('[API:products] Skipping watch-specific filters for non-watch category');
  }
  
  // Apply gender filter (with special handling using better text search)
  query = applyGenderFilter(query, params);
  
  query = applySpecialFilters(query, params);
  
  return query;
};

// Re-export all filter functions for backwards compatibility
export {
  applyBrandFilter,
  applyCategoryFilter,
  applyGenderFilter,
  applyPriceFilter,
  applyCaseSizeFilter,
  applyBandFilter,
  applyCaseColorFilter,
  applyColorFilter,
  applySpecialFilters
};
