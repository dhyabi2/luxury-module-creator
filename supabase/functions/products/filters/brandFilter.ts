
// Brand filter implementation
export const applyBrandFilter = (query: any, params: any) => {
  if (params.brand) {
    const brands = params.brand.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
    
    // If "all" is included or empty, don't filter by brand
    if (brands.includes('all') || brands.length === 0) {
      console.log('[API:products] Skipping brand filter due to "all" selection');
      return query;
    }
    
    // Fix for brand filtering - use array contains for exact match
    if (brands.length === 1) {
      // For single brand, use case insensitive comparison
      console.log(`[API:products] Single brand filter (case-insensitive): ${brands[0]}`);
      query = query.ilike('brand', brands[0]);
    } else {
      // For multiple brands, use 'in' operator with array
      console.log(`[API:products] Multiple brands filter with in operator: ${brands.join(', ')}`);
      query = query.in('brand', brands);
    }
  }
  return query;
};
