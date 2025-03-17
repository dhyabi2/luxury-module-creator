
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply gender filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param gender - The gender filter value
 * @returns The modified query with gender filter applied
 */
export const applyGenderFilter = (query: PostgrestFilterBuilder<any, any, any>, gender: string | undefined) => {
  if (!gender || gender.trim() === '') return query;
  
  console.log(`[DB:products] Applying gender filter: ${gender}`);
  
  if (gender.includes(',')) {
    const genders = gender.split(',').map((g: string) => g.trim());
    console.log(`[DB:products] Applying multiple gender filters: ${genders.join(', ')}`);
    
    // For multiple genders, build OR conditions
    const genderConditions = genders.map(g => 
      `specifications->gender.eq.${g}`
    ).join(',');
    
    console.log(`[DB:products] Gender filter conditions: ${genderConditions}`);
    query = query.or(genderConditions);
  } else {
    console.log(`[DB:products] Applying single gender filter: ${gender}`);
    query = query.eq('specifications->>gender', gender);
  }
  
  return query;
};

/**
 * Apply case size filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param minCaseSize - Minimum case size
 * @param maxCaseSize - Maximum case size
 * @returns The modified query with case size filter applied
 */
export const applyCaseSizeFilter = (
  query: PostgrestFilterBuilder<any, any, any>, 
  minCaseSize: number | undefined, 
  maxCaseSize: number | undefined
) => {
  if (minCaseSize !== undefined || maxCaseSize !== undefined) {
    console.log(`[DB:products] Applying case size filter: ${minCaseSize || 'min'}-${maxCaseSize || 'max'}`);
    
    // Ensure specifications is not null
    query = query.not('specifications', 'is', null);
    
    if (minCaseSize !== undefined) {
      console.log(`[DB:products] Building minimum case size query: >= ${minCaseSize}mm`);
      query = query.gte('specifications->>caseSize', `${minCaseSize}mm`);
    }
    
    if (maxCaseSize !== undefined) {
      console.log(`[DB:products] Applying maximum case size filter: <= ${maxCaseSize}mm`);
      query = query.lte('specifications->>caseSize', `${maxCaseSize}mm`);
    }
  }
  
  return query;
};

/**
 * Apply band filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param band - The band filter value
 * @returns The modified query with band filter applied
 */
export const applyBandFilter = (query: PostgrestFilterBuilder<any, any, any>, band: string | undefined) => {
  if (!band || band.trim() === '') return query;
  
  const bands = band.split(',').map((b: string) => b.trim());
  console.log(`[DB:products] Applying band material filter: ${bands.join(', ')}`);
  
  // Use contains for first value
  query = query.contains('specifications', { strapMaterial: bands[0] });
  
  // For multiple band materials, use proper OR syntax
  if (bands.length > 1) {
    const orConditions = bands.slice(1).map(b => 
      `specifications->strapMaterial.eq.${b}`
    ).join(',');
    
    console.log(`[DB:products] Applying additional band conditions: ${orConditions}`);
    query = query.or(orConditions);
  }
  
  return query;
};

/**
 * Apply case color filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param caseColor - The case color filter value
 * @returns The modified query with case color filter applied
 */
export const applyCaseColorFilter = (query: PostgrestFilterBuilder<any, any, any>, caseColor: string | undefined) => {
  if (!caseColor || caseColor.trim() === '') return query;
  
  const colors = caseColor.split(',').map((c: string) => c.trim());
  console.log(`[DB:products] Applying case material filter: ${colors.join(', ')}`);
  
  // Use contains for first value
  query = query.contains('specifications', { caseMaterial: colors[0] });
  
  // For multiple case colors, use proper OR syntax
  if (colors.length > 1) {
    const orConditions = colors.slice(1).map(color => 
      `specifications->caseMaterial.eq.${color}`
    ).join(',');
    
    console.log(`[DB:products] Applying additional case material conditions: ${orConditions}`);
    query = query.or(orConditions);
  }
  
  return query;
};

/**
 * Apply color filter to the query
 * 
 * @param query - The Supabase query to modify
 * @param color - The color filter value
 * @returns The modified query with color filter applied
 */
export const applyColorFilter = (query: PostgrestFilterBuilder<any, any, any>, color: string | undefined) => {
  if (!color || color.trim() === '') return query;
  
  const colors = color.split(',').map((c: string) => c.trim());
  
  if (colors.length === 1) {
    const singleColor = colors[0];
    console.log(`[DB:products] Applying single color filter: ${singleColor}`);
    query = query.or(`specifications->dialColor.eq.${singleColor},specifications->strapColor.eq.${singleColor}`);
  } else {
    console.log(`[DB:products] Applying multiple color filters: ${colors.join(', ')}`);
    
    // Build proper OR conditions for multiple colors
    const colorConditions = colors.flatMap(c => [
      `specifications->dialColor.eq.${c}`,
      `specifications->strapColor.eq.${c}`
    ]).join(',');
    
    console.log(`[DB:products] Color filter conditions: ${colorConditions}`);
    query = query.or(colorConditions);
  }
  
  return query;
};
