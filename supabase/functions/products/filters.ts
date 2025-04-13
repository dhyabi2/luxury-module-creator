
// Apply brand filter
export const applyBrandFilter = (query: any, params: any) => {
  if (params.brand) {
    const brands = params.brand.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
    
    if (brands.length === 1) {
      query = query.eq('brand', brands[0]);
    } else {
      // Use OR logic for multiple brands
      query = query.or(brands.map((brand: string) => `brand.eq.${brand}`).join(','));
    }
  }
  return query;
};

// Apply category filter - Updated to use OR logic
export const applyCategoryFilter = (query: any, params: any) => {
  if (params.category) {
    const categories = params.category.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
    
    // Use OR logic for multiple categories
    if (categories.length > 0) {
      const orConditions = categories.map(cat => `category.ilike.%${cat}%`).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};

// Apply gender filter with OR logic - FIXED
export const applyGenderFilter = (query: any, params: any) => {
  if (params.gender) {
    const genders = params.gender.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders: ${genders.join(', ')}`);
    
    if (genders.length > 0) {
      // For non-watch categories, use simplified approach without JSONB operators
      if (params.category && 
          (params.category.toLowerCase().includes('accessories') || 
           params.category.toLowerCase().includes('bags') || 
           params.category.toLowerCase().includes('perfumes'))) {
        // Skip gender filter for non-watch categories
        console.log('[API:products] Skipping detailed gender filter for non-watch category');
        return query;
      } else {
        // Fixed approach for watches - use containedBy for each gender with OR
        if (genders.length === 1) {
          query = query.contains('specifications', { gender: genders[0] });
        } else {
          // For multiple genders, build an OR condition string with contains for each
          const orConditions = genders.map(gender => 
            `specifications->gender.eq.${gender}`
          ).join(',');
          query = query.or(orConditions);
        }
      }
    }
  }
  return query;
};

// Apply price range filter
export const applyPriceFilter = (query: any, params: any) => {
  if (params.minPrice && params.maxPrice) {
    console.log(`[API:products] Filtering by price range: $${params.minPrice} - $${params.maxPrice}`);
    query = query.gte('price', parseFloat(params.minPrice))
             .lte('price', parseFloat(params.maxPrice));
  }
  return query;
};

// Apply case size filter - FIXED to avoid SQL parse errors
export const applyCaseSizeFilter = (query: any, params: any) => {
  // Skip this filter for non-watch categories to avoid errors
  if (params.category && 
      (params.category.toLowerCase().includes('accessories') || 
       params.category.toLowerCase().includes('bags') || 
       params.category.toLowerCase().includes('perfumes'))) {
    console.log('[API:products] Skipping case size filter for non-watch category');
    return query;
  }
  
  if (params.minCaseSize && params.maxCaseSize) {
    console.log(`[API:products] Filtering by case size: ${params.minCaseSize}mm - ${params.maxCaseSize}mm`);
    
    try {
      // Use a simplified approach that won't break with large size ranges
      query = query.or(`specifications->caseSize.gte.${params.minCaseSize},specifications->caseSize.lte.${params.maxCaseSize}`);
    } catch (error) {
      console.error('[API:products] Error applying case size filter:', error);
      // If filter fails, return the unmodified query
    }
  }
  return query;
};

// Apply band material filter with OR logic
export const applyBandFilter = (query: any, params: any) => {
  if (params.band) {
    const bands = params.band.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by band materials: ${bands.join(', ')}`);
    
    if (bands.length > 0) {
      // Use OR logic for multiple bands
      const orConditions = bands.map(band => `specifications->strapMaterial.ilike.%${band}%`).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};

// Apply case color filter with OR logic
export const applyCaseColorFilter = (query: any, params: any) => {
  if (params.caseColor) {
    const caseColors = params.caseColor.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by case colors: ${caseColors.join(', ')}`);
    
    if (caseColors.length > 0) {
      // Use OR logic for multiple case colors
      const orConditions = caseColors.map(color => `specifications->caseMaterial.ilike.%${color}%`).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};

// Apply dial/strap color filter with OR logic
export const applyColorFilter = (query: any, params: any) => {
  if (params.color) {
    const colors = params.color.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by colors: ${colors.join(', ')}`);
    
    if (colors.length > 0) {
      // Use OR logic for multiple colors
      const orConditions = colors.map(color => 
        `specifications->dialColor.ilike.%${color}%,specifications->strapColor.ilike.%${color}%`
      ).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};

// Apply special filters (new arrivals, sale)
export const applySpecialFilters = (query: any, params: any) => {
  // New arrivals filter
  if (params.isNewIn === 'true') {
    console.log('[API:products] Filtering by new arrivals');
    // Simulate new items by getting latest IDs
    query = query.order('id', { ascending: false }).limit(50);
  }
  
  // Sale items filter
  if (params.isOnSale === 'true') {
    console.log('[API:products] Filtering by sale items');
    query = query.gt('discount', 0);
  }
  
  return query;
};

// Apply all filters to a query
export const applyAllFilters = (query: any, params: any) => {
  console.log('[API:products] Building Supabase query with filters:', params);
  
  query = applyBrandFilter(query, params);
  query = applyCategoryFilter(query, params);
  query = applyPriceFilter(query, params);
  
  // Skip watch-specific filters for non-watch categories
  const isNonWatchCategory = params.category && 
    (typeof params.category === 'string' && 
      (params.category.toLowerCase().includes('accessories') || 
       params.category.toLowerCase().includes('bags') || 
       params.category.toLowerCase().includes('perfumes')));
       
  if (!isNonWatchCategory) {
    console.log('[API:products] Applying watch-specific filters');
    query = applyCaseSizeFilter(query, params);
    query = applyBandFilter(query, params);
    query = applyCaseColorFilter(query, params);
    query = applyColorFilter(query, params);
  } else {
    console.log('[API:products] Skipping watch-specific filters for non-watch category');
  }
  
  // Apply gender filter - always include, but with special handling
  query = applyGenderFilter(query, params);
  
  query = applySpecialFilters(query, params);
  
  return query;
};
