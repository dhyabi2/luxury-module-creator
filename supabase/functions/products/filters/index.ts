
// Re-export filters modules from the filters directory
import { applyBrandFilter } from './brandFilter.ts';
import { applyCategoryFilter } from './categoryFilter.ts';
import { applyGenderFilter } from './genderFilter.ts';
import { applyPriceFilter } from './priceFilter.ts';
import { 
  applyCaseSizeFilter, 
  applyBandFilter, 
  applyCaseColorFilter, 
  applyColorFilter 
} from './watchFilters.ts';
import { applySpecialFilters } from './specialFilters.ts';

// Apply all filters to a query
export const applyAllFilters = (query: any, params: any) => {
  console.log('[API:products] Building Supabase query with filters:', params);
  
  query = applyBrandFilter(query, params);
  query = applyCategoryFilter(query, params);
  query = applyPriceFilter(query, params);
  
  // Check for watch-specific category
  const isWatchCategory = params.category && params.category.toLowerCase().includes('watches');
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
  
  // Apply special filters including clearance and instock
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
