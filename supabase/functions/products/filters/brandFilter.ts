
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
    
    // Fix for brand filtering
    if (brands.length === 1) {
      // For single brand, use exact match (case insensitive)
      query = query.ilike('brand', brands[0]);
    } else {
      // For multiple brands, build OR conditions
      // This ensures exact matches for each brand
      const orConditions = brands.map(brand => `brand.ilike.${brand}`).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};
