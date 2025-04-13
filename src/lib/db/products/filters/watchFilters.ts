
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
    
    // Create a more robust filter that works with multiple genders
    if (genders.length > 0) {
      // Use text search for all cases - much more reliable for mixed data types
      const textConditions = [];
      
      for (const gender of genders) {
        // Use multiple variations to catch different JSON formats
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
    
    // Use text search for case size values 
    let sizeConditions = [];
    for (let size = minSize; size <= maxSize; size++) {
      sizeConditions.push(`specifications::text ilike '%"caseSize":"${size}mm"%'`);
      sizeConditions.push(`specifications::text ilike '%"caseSize": "${size}mm"%'`);
    }
    
    if (sizeConditions.length > 0) {
      query = query.or(sizeConditions.join(','));
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
    
    // Use text search which is more reliable than JSONB for multiple values
    if (bands.length > 0) {
      const orConditions = [];
      
      for (let i = 0; i < bands.length; i++) {
        orConditions.push(`specifications::text ilike '%"strapMaterial":"${bands[i]}"%'`);
        orConditions.push(`specifications::text ilike '%"strapMaterial": "${bands[i]}"%'`);
      }
      
      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
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
    
    // Use text search which is more reliable than JSONB for multiple values
    if (caseColors.length > 0) {
      const orConditions = [];
      
      for (let i = 0; i < caseColors.length; i++) {
        orConditions.push(`specifications::text ilike '%"caseMaterial":"${caseColors[i]}"%'`);
        orConditions.push(`specifications::text ilike '%"caseMaterial": "${caseColors[i]}"%'`);
      }
      
      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
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
    
    // Use text search for colors which is more reliable
    if (colors.length > 0) {
      let colorConditions = [];
      
      for (let i = 0; i < colors.length; i++) {
        colorConditions.push(`specifications::text ilike '%"dialColor":"${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"strapColor":"${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"dialColor": "${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"strapColor": "${colors[i]}"%'`);
      }
      
      if (colorConditions.length > 0) {
        query = query.or(colorConditions.join(','));
      }
    }
  }
  
  return query;
};
