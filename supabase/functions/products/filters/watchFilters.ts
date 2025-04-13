
// Watch-specific filters implementation

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
