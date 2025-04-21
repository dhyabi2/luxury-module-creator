
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
    
    // Fix for brand filtering - use case insensitive comparison
    if (brands.length === 1) {
      // For single brand, use exact match (case insensitive)
      console.log(`[API:products] Applying single brand filter with ilike: ${brands[0]}`);
      query = query.ilike('brand', brands[0]);
    } else {
      // For multiple brands, build proper OR conditions with case insensitivity
      console.log(`[API:products] Applying multiple brands filter with multiple ilikes: ${brands.join(', ')}`);
      // Convert to lowercase for case insensitive comparison
      const orConditions = brands.map(brand => {
        return `brand.ilike.${brand}`;
      }).join(',');
      console.log(`[API:products] OR conditions: ${orConditions}`);
      query = query.or(orConditions);
    }
  }
  return query;
};
