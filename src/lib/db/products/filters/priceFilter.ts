
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply price range filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns The modified query with price range filter applied
 */
export const applyPriceFilter = (
  query: PostgrestFilterBuilder<any, any, any>, 
  minPrice: number | undefined, 
  maxPrice: number | undefined
) => {
  if (minPrice !== undefined && maxPrice !== undefined) {
    console.log(`[DB:products] Applying price range filter: ${minPrice}-${maxPrice}`);
    query = query.gte('price', minPrice).lte('price', maxPrice);
  }
  
  return query;
};
