
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
    
    // Use containedBy for JSONB which is more reliable
    if (genders.length > 0) {
      const genderFilter: any = {};
      genderFilter['gender'] = genders[0];
      
      // Use containedBy for JSONB
      query = query.containedBy('specifications', genderFilter);
      
      // For multiple genders, add OR conditions
      if (genders.length > 1) {
        let orConditions = [];
        for (let i = 1; i < genders.length; i++) {
          const additionalFilter: any = {};
          additionalFilter['gender'] = genders[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
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
    
    // Use containedBy for JSONB
    if (bands.length > 0) {
      const bandFilter: any = {};
      bandFilter['strapMaterial'] = bands[0];
      
      // Use containedBy for JSONB
      query = query.containedBy('specifications', bandFilter);
      
      // For multiple bands, add OR conditions
      if (bands.length > 1) {
        let orConditions = [];
        for (let i = 1; i < bands.length; i++) {
          const additionalFilter: any = {};
          additionalFilter['strapMaterial'] = bands[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
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
    
    // Use containedBy for JSONB
    if (caseColors.length > 0) {
      const caseColorFilter: any = {};
      caseColorFilter['caseMaterial'] = caseColors[0];
      
      // Use containedBy for JSONB
      query = query.containedBy('specifications', caseColorFilter);
      
      // For multiple case colors, add OR conditions
      if (caseColors.length > 1) {
        let orConditions = [];
        for (let i = 1; i < caseColors.length; i++) {
          const additionalFilter: any = {};
          additionalFilter['caseMaterial'] = caseColors[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
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
