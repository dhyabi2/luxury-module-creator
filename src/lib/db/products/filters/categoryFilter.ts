
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply category filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param category - The category filter value
 * @returns The modified query with category filter applied
 */
export const applyCategoryFilter = (query: PostgrestFilterBuilder<any, any, any>, category: string | undefined) => {
  if (!category || category.trim() === '') return query;
  
  console.log(`[DB:products] Raw category value: "${category}"`);
  
  if (category.includes(',')) {
    const categoryValues = category.split(',').map((c: string) => c.trim().toLowerCase());
    console.log(`[DB:products] Applying multiple categories filter: ${categoryValues.join(', ')}`);
    
    if (categoryValues.length === 1) {
      // Simple case for a single category - use exact match
      query = query.eq('category', categoryValues[0]);
    } else {
      // For multiple categories
      query = query.in('category', categoryValues);
    }
  } else {
    console.log(`[DB:products] Applying single category filter: ${category}`);
    query = query.eq('category', category.toLowerCase());
  }
  
  return query;
};
