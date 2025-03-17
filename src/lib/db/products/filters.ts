
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Apply all filters to the query
 * 
 * @param query - The Supabase query to modify
 * @param filters - The filters to apply
 * @returns The modified query with all filters applied
 */
export const applyFilters = (query: PostgrestFilterBuilder<any, any, any>, filters: any) => {
  // Extract categories for smart filtering
  const categories = filters.category && filters.category.trim() !== '' 
    ? filters.category.split(',').map((c: string) => c.trim().toLowerCase())
    : [];
  
  // Check if filtering includes non-watch categories
  const hasNonWatchCategories = categories.some(cat => 
    ['accessories', 'bags', 'perfumes'].includes(cat.toLowerCase())
  );
  
  console.log(`[DB:products] Has non-watch categories: ${hasNonWatchCategories}`);
  
  // Apply brand filter
  query = applyBrandFilter(query, filters.brand);
  
  // Apply category filter
  query = applyCategoryFilter(query, filters.category);
  
  // Apply price range filter
  query = applyPriceFilter(query, filters.minPrice, filters.maxPrice);
  
  // Skip watch-specific filters for non-watch categories
  if (!hasNonWatchCategories) {
    console.log('[DB:products] Applying watch-specific filters');
    
    // Apply gender filter
    query = applyGenderFilter(query, filters.gender);
    
    // Apply case size filter
    query = applyCaseSizeFilter(query, filters.minCaseSize, filters.maxCaseSize);
    
    // Apply band filter
    query = applyBandFilter(query, filters.band);
    
    // Apply case color filter
    query = applyCaseColorFilter(query, filters.caseColor);
    
    // Apply color filter
    query = applyColorFilter(query, filters.color);
  } else {
    console.log('[DB:products] Skipping watch-specific filters for non-watch categories');
  }
  
  return query;
};

/**
 * Apply brand filter to the query
 */
const applyBrandFilter = (query: PostgrestFilterBuilder<any, any, any>, brand: string | undefined) => {
  if (!brand || brand.trim() === '') return query;
  
  if (brand.includes(',')) {
    const brands = brand.split(',').map((b: string) => b.trim());
    console.log(`[DB:products] Applying multiple brands filter: ${brands.join(', ')}`);
    query = query.in('brand', brands); // Use 'in' operator for multiple brands
  } else {
    console.log(`[DB:products] Applying single brand filter: ${brand}`);
    query = query.ilike('brand', `%${brand}%`);
  }
  
  return query;
};

/**
 * Apply category filter to the query
 */
const applyCategoryFilter = (query: PostgrestFilterBuilder<any, any, any>, category: string | undefined) => {
  if (!category || category.trim() === '') return query;
  
  console.log(`[DB:products] Raw category value: "${category}"`);
  
  if (category.includes(',')) {
    const categoryValues = category.split(',').map((c: string) => c.trim());
    console.log(`[DB:products] Applying multiple categories filter: ${categoryValues.join(', ')}`);
    
    if (categoryValues.length === 1) {
      // Simple case for a single category
      query = query.ilike('category', `%${categoryValues[0]}%`);
    } else {
      // For multiple categories, use Supabase's OR syntax properly
      const firstCategory = categoryValues[0];
      query = query.or(categoryValues.map(cat => `category.ilike.%${cat}%`).join(','));
    }
  } else {
    console.log(`[DB:products] Applying single category filter: ${category}`);
    query = query.ilike('category', `%${category}%`);
  }
  
  return query;
};

/**
 * Apply gender filter to the query
 */
const applyGenderFilter = (query: PostgrestFilterBuilder<any, any, any>, gender: string | undefined) => {
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
 * Apply price range filter to the query
 */
const applyPriceFilter = (
  query: PostgrestFilterBuilder<any, any, any>, 
  minPrice: number | undefined, 
  maxPrice: number | undefined
) => {
  if (minPrice !== undefined && maxPrice !== undefined) {
    console.log(`[DB:products] Applying price range filter: ${minPrice}-${maxPrice}`);
    query = query.gte('price', minPrice).lte('price', maxPrice);
  }
  
  return query;
};

/**
 * Apply case size filter to the query
 */
const applyCaseSizeFilter = (
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
 */
const applyBandFilter = (query: PostgrestFilterBuilder<any, any, any>, band: string | undefined) => {
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
 */
const applyCaseColorFilter = (query: PostgrestFilterBuilder<any, any, any>, caseColor: string | undefined) => {
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
 */
const applyColorFilter = (query: PostgrestFilterBuilder<any, any, any>, color: string | undefined) => {
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
