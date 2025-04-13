
// Apply brand filter
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

// Apply category filter - Updated to use OR logic
export const applyCategoryFilter = (query: any, params: any) => {
  if (params.category) {
    const categories = params.category.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
    
    // If "all" is included or empty, don't filter by category
    if (categories.includes('all') || categories.length === 0) {
      console.log('[API:products] Skipping category filter due to "all" selection');
      return query;
    }
    
    // Use OR logic for multiple categories
    if (categories.length > 0) {
      const orConditions = categories.map(cat => `category.ilike.%${cat}%`).join(',');
      query = query.or(orConditions);
    }
  }
  return query;
};

// Apply gender filter with better text search
export const applyGenderFilter = (query: any, params: any) => {
  // Check for standard gender parameter
  if (params.gender) {
    const genders = params.gender.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders (standard): ${genders.join(', ')}`);
    
    // If "all" is included or empty, don't filter by gender
    if (genders.includes('all') || genders.length === 0) {
      console.log('[API:products] Skipping gender filter due to "all" selection');
      return query;
    }
    
    if (genders.length > 0) {
      // Use text search for multiple genders which is more reliable
      const textConditions = [];
      for (const gender of genders) {
        textConditions.push(`specifications::text ilike '%"gender":"${gender}"%'`);
        textConditions.push(`specifications::text ilike '%"gender": "${gender}"%'`);
      }
      query = query.or(textConditions.join(','));
    }
    return query;
  }
  
  // Special handling for gender search parameter - this fixes the watches + gender issue
  if (params.genderSearch) {
    const genders = params.genderSearch.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders (text search): ${genders.join(', ')}`);
    
    // If "all" is included or empty, don't filter by gender
    if (genders.includes('all') || genders.length === 0) {
      console.log('[API:products] Skipping gender text search due to "all" selection');
      return query;
    }
    
    const watchesCategory = params.category && params.category.includes('watches');
    
    if (genders.length > 0 && watchesCategory) {
      console.log('[API:products] Using optimized text search for watches + gender combination');
      
      // Direct text search on the JSON column as text
      const textConditions = [];
      for (const gender of genders) {
        // Add multiple variations to catch different JSON formats
        textConditions.push(`specifications::text ilike '%"gender":"${gender}"%'`);
        textConditions.push(`specifications::text ilike '%"gender": "${gender}"%'`);
      }
      
      if (textConditions.length > 0) {
        // Use OR for any gender match
        query = query.or(textConditions.join(','));
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
    
    // If "all" is included or empty, don't filter
    if (bands.includes('all') || bands.length === 0) {
      console.log('[API:products] Skipping band filter due to "all" selection');
      return query;
    }
    
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
    
    // If "all" is included or empty, don't filter
    if (caseColors.includes('all') || caseColors.length === 0) {
      console.log('[API:products] Skipping case color filter due to "all" selection');
      return query;
    }
    
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
    
    // If "all" is included or empty, don't filter
    if (colors.includes('all') || colors.length === 0) {
      console.log('[API:products] Skipping color filter due to "all" selection');
      return query;
    }
    
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
  
  // Check for watch-specific category
  const isWatchCategory = params.category && params.category.includes('watches');
  const isNonWatchCategory = params.category && 
    (params.category.toLowerCase().includes('accessories') || 
     params.category.toLowerCase().includes('bags') || 
     params.category.toLowerCase().includes('perfumes'));
       
  if (isWatchCategory || !isNonWatchCategory) {
    console.log('[API:products] Applying watch-specific filters');
    query = applyCaseSizeFilter(query, params);
    query = applyBandFilter(query, params);
    query = applyCaseColorFilter(query, params);
    query = applyColorFilter(query, params);
  } else {
    console.log('[API:products] Skipping watch-specific filters for non-watch category');
  }
  
  // Apply gender filter (with special handling using better text search)
  query = applyGenderFilter(query, params);
  
  query = applySpecialFilters(query, params);
  
  return query;
};
