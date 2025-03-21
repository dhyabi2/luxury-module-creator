
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply brand filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param brand - The brand filter value
 * @returns The modified query with brand filter applied
 */
export const applyBrandFilter = (query: PostgrestFilterBuilder<any, any, any>, brand: string | undefined) => {
  if (!brand || brand.trim() === '') return query;
  
  console.log(`[DB:products] Applying brand filter: ${brand}`);
  
  if (brand.includes(',')) {
    const brands = brand.split(',').map((b: string) => b.trim());
    console.log(`[DB:products] Applying multiple brands filter: ${brands.join(', ')}`);
    query = query.in('brand', brands); // Use 'in' operator for multiple brands
  } else {
    console.log(`[DB:products] Applying single brand filter: ${brand}`);
    query = query.eq('brand', brand); // Use exact match for single brand
  }
  
  return query;
};
