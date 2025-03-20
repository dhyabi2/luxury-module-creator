// Apply brand filter
export const applyBrandFilter = (query: any, params: any) => {
  if (params.brand) {
    const brands = params.brand.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
    query = query.in('brand', brands);
  }
  return query;
};

// Apply category filter - Updated to be more resilient
export const applyCategoryFilter = (query: any, params: any) => {
  if (params.category) {
    const categories = params.category.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
    
    // First category
    if (categories.length > 0) {
      query = query.ilike('category', `%${categories[0]}%`);
      
      // Additional categories
      if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
          query = query.or(`category.ilike.%${categories[i]}%`);
        }
      }
    }
  }
  return query;
};

// Apply gender filter
export const applyGenderFilter = (query: any, params: any) => {
  if (params.gender) {
    const genders = params.gender.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders: ${genders.join(', ')}`);
    
    if (genders.length > 0) {
      // Simplified approach for gender filter
      query = query.ilike('specifications->gender', `%${genders[0]}%`);
      
      if (genders.length > 1) {
        for (let i = 1; i < genders.length; i++) {
          query = query.or(`specifications->gender.ilike.%${genders[i]}%`);
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

// Apply band material filter
export const applyBandFilter = (query: any, params: any) => {
  if (params.band) {
    const bands = params.band.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by band materials: ${bands.join(', ')}`);
    
    if (bands.length > 0) {
      // Simplified approach
      query = query.ilike('specifications->strapMaterial', `%${bands[0]}%`);
      
      if (bands.length > 1) {
        for (let i = 1; i < bands.length; i++) {
          query = query.or(`specifications->strapMaterial.ilike.%${bands[i]}%`);
        }
      }
    }
  }
  return query;
};

// Apply case color filter
export const applyCaseColorFilter = (query: any, params: any) => {
  if (params.caseColor) {
    const caseColors = params.caseColor.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by case colors: ${caseColors.join(', ')}`);
    
    if (caseColors.length > 0) {
      // Simplified approach
      query = query.ilike('specifications->caseMaterial', `%${caseColors[0]}%`);
      
      if (caseColors.length > 1) {
        for (let i = 1; i < caseColors.length; i++) {
          query = query.or(`specifications->caseMaterial.ilike.%${caseColors[i]}%`);
        }
      }
    }
  }
  return query;
};

// Apply dial/strap color filter
export const applyColorFilter = (query: any, params: any) => {
  if (params.color) {
    const colors = params.color.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by colors: ${colors.join(', ')}`);
    
    if (colors.length > 0) {
      // Simplified approach that won't cause SQL parser errors
      query = query.or(`specifications->dialColor.ilike.%${colors[0]}%,specifications->strapColor.ilike.%${colors[0]}%`);
      
      if (colors.length > 1) {
        for (let i = 1; i < colors.length; i++) {
          query = query.or(`specifications->dialColor.ilike.%${colors[i]}%,specifications->strapColor.ilike.%${colors[i]}%`);
        }
      }
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
  console.log('[API:products] Building Supabase query with filters');
  
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
  
  query = applySpecialFilters(query, params);
  
  return query;
};
