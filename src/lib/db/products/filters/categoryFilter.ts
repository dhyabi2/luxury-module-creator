
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
    const categoryValues = category.split(',').map((c: string) => c.trim());
    console.log(`[DB:products] Applying multiple categories filter: ${categoryValues.join(', ')}`);
    
    if (categoryValues.length === 1) {
      // Simple case for a single category
      query = query.ilike('category', `%${categoryValues[0]}%`);
    } else {
      // For multiple categories, use Supabase's OR syntax properly
      const firstCategory = categoryValues[0];
      query = query.or(categoryValues.map(cat => `category.ilike.%${cat}%`).join(','));
    }
  } else {
    console.log(`[DB:products] Applying single category filter: ${category}`);
    query = query.ilike('category', `%${category}%`);
  }
  
  return query;
};
