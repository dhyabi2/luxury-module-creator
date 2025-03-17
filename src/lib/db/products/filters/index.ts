
/**
 * Main filters module - exports all filter functions
 */
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { applyBrandFilter } from './brandFilter';
import { applyCategoryFilter } from './categoryFilter'; 
import { applyPriceFilter } from './priceFilter';
import { 
  applyGenderFilter,
  applyCaseSizeFilter,
  applyBandFilter,
  applyCaseColorFilter,
  applyColorFilter
} from './watchFilters';

/**
 * Apply all filters to the query
 * 
 * @param query - The Supabase query to modify
 * @param filters - The filters to apply
 * @returns The modified query with all filters applied
 */
export const applyFilters = (query: PostgrestFilterBuilder<any, any, any>, filters: any) => {
  // Extract categories for smart filtering
  const categories = filters.category && filters.category.trim() !== '' 
    ? filters.category.split(',').map((c: string) => c.trim().toLowerCase())
    : [];
  
  // Check if filtering includes non-watch categories
  const hasNonWatchCategories = categories.some(cat => 
    ['accessories', 'bags', 'perfumes'].includes(cat.toLowerCase())
  );
  
  console.log(`[DB:products] Has non-watch categories: ${hasNonWatchCategories}`);
  
  // Apply brand filter
  query = applyBrandFilter(query, filters.brand);
  
  // Apply category filter
  query = applyCategoryFilter(query, filters.category);
  
  // Apply price range filter
  query = applyPriceFilter(query, filters.minPrice, filters.maxPrice);
  
  // Skip watch-specific filters for non-watch categories
  if (!hasNonWatchCategories) {
    console.log('[DB:products] Applying watch-specific filters');
    
    // Apply gender filter
    query = applyGenderFilter(query, filters.gender);
    
    // Apply case size filter
    query = applyCaseSizeFilter(query, filters.minCaseSize, filters.maxCaseSize);
    
    // Apply band filter
    query = applyBandFilter(query, filters.band);
    
    // Apply case color filter
    query = applyCaseColorFilter(query, filters.caseColor);
    
    // Apply color filter
    query = applyColorFilter(query, filters.color);
  } else {
    console.log('[DB:products] Skipping watch-specific filters for non-watch categories');
  }
  
  return query;
};

// Re-export all filter functions
export {
  applyBrandFilter,
  applyCategoryFilter,
  applyPriceFilter,
  applyGenderFilter,
  applyCaseSizeFilter,
  applyBandFilter,
  applyCaseColorFilter,
  applyColorFilter
};
