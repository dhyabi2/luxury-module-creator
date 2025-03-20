
/**
 * Apply watch-specific filters to the query
 */

/**
 * Apply gender filter
 * 
 * @param query - The Supabase query to modify
 * @param gender - The gender to filter by
 * @returns The modified query with gender filter applied
 */
export const applyGenderFilter = (query: any, gender: string) => {
  if (gender && gender.trim() !== '') {
    console.log(`[DB:products] Filtering by gender: ${gender}`);
    
    const genders = gender.split(',').map(g => g.trim());
    
    // Use contains for JSON data instead of eq
    if (genders.length > 0) {
      // Use contains which is safer for JSON fields
      query = query.contains('specifications', { gender: genders[0] });
      
      // For multiple genders, use OR conditions
      if (genders.length > 1) {
        for (let i = 1; i < genders.length; i++) {
          query = query.or(`specifications->gender.eq.${genders[i]}`);
        }
      }
    }
  }
  
  return query;
};

/**
 * Apply case size filter
 * 
 * @param query - The Supabase query to modify
 * @param minCaseSize - The minimum case size
 * @param maxCaseSize - The maximum case size
 * @returns The modified query with case size filter applied
 */
export const applyCaseSizeFilter = (query: any, minCaseSize: string, maxCaseSize: string) => {
  if (minCaseSize && maxCaseSize) {
    console.log(`[DB:products] Filtering by case size range: ${minCaseSize}mm - ${maxCaseSize}mm`);
    
    const minSize = parseInt(minCaseSize);
    const maxSize = parseInt(maxCaseSize);
    
    // Use a more lenient range-based approach
    for (let size = minSize; size <= maxSize; size++) {
      query = query.or(`specifications->caseSize.like.%${size}mm%`);
    }
  }
  
  return query;
};

/**
 * Apply band filter
 * 
 * @param query - The Supabase query to modify
 * @param band - The band material to filter by
 * @returns The modified query with band filter applied
 */
export const applyBandFilter = (query: any, band: string) => {
  if (band && band.trim() !== '') {
    console.log(`[DB:products] Filtering by band material: ${band}`);
    
    const bands = band.split(',').map(b => b.trim());
    
    // Use contains for JSON data
    if (bands.length > 0) {
      query = query.contains('specifications', { strapMaterial: bands[0] });
      
      // For additional bands, use OR conditions
      if (bands.length > 1) {
        for (let i = 1; i < bands.length; i++) {
          query = query.or(`specifications->strapMaterial.eq.${bands[i]}`);
        }
      }
    }
  }
  
  return query;
};

/**
 * Apply case color filter
 * 
 * @param query - The Supabase query to modify
 * @param caseColor - The case color to filter by
 * @returns The modified query with case color filter applied
 */
export const applyCaseColorFilter = (query: any, caseColor: string) => {
  if (caseColor && caseColor.trim() !== '') {
    console.log(`[DB:products] Filtering by case color: ${caseColor}`);
    
    const caseColors = caseColor.split(',').map(c => c.trim());
    
    // Use contains for JSON data
    if (caseColors.length > 0) {
      query = query.contains('specifications', { caseMaterial: caseColors[0] });
      
      // For additional case colors, use OR conditions
      if (caseColors.length > 1) {
        for (let i = 1; i < caseColors.length; i++) {
          query = query.or(`specifications->caseMaterial.eq.${caseColors[i]}`);
        }
      }
    }
  }
  
  return query;
};

/**
 * Apply color filter
 * 
 * @param query - The Supabase query to modify
 * @param color - The color to filter by
 * @returns The modified query with color filter applied
 */
export const applyColorFilter = (query: any, color: string) => {
  if (color && color.trim() !== '') {
    console.log(`[DB:products] Filtering by color: ${color}`);
    
    const colors = color.split(',').map(c => c.trim());
    
    // Use reliable OR conditions for multiple fields
    if (colors.length > 0) {
      query = query.or(`specifications->dialColor.eq.${colors[0]},specifications->strapColor.eq.${colors[0]}`);
      
      // Add OR conditions for additional colors
      for (let i = 1; i < colors.length; i++) {
        query = query.or(`specifications->dialColor.eq.${colors[i]},specifications->strapColor.eq.${colors[i]}`);
      }
    }
  }
  
  return query;
};
