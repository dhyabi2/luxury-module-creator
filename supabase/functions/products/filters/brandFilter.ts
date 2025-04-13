
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
    
    if (brands.length === 1) {
      query = query.eq('brand', brands[0]);
    } else {
      // Use OR logic for multiple brands
      query = query.or(brands.map((brand: string) => `brand.eq.${brand}`).join(','));
    }
  }
  return query;
};
