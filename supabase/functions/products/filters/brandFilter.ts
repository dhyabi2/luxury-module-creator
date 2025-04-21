
// Brand filter implementation with improved handling
export const applyBrandFilter = (query: any, params: any) => {
  if (!params.brand) {
    return query;
  }
  
  const brands = params.brand.split(',').map((b: string) => b.trim());
  console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
  
  // If "all" is included or empty, don't filter by brand
  if (brands.includes('all') || brands.length === 0) {
    console.log('[API:products] Skipping brand filter due to "all" selection');
    return query;
  }
  
  // Use ilike for case-insensitive matching
  if (brands.length === 1) {
    console.log(`[API:products] Single brand filter: ${brands[0]}`);
    return query.ilike('brand', `%${brands[0]}%`);
  } 
  
  // For multiple brands, create OR conditions with ilike
  const orConditions = brands.map((brand: string) => `brand.ilike.%${brand}%`).join(',');
  console.log(`[API:products] Multiple brands OR filter: ${orConditions}`);
  return query.or(orConditions);
};
