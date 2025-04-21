
// Apply case size filter with improved range handling
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
      // Since case size could be stored as string (with "mm" suffix) or number,
      // we need a more flexible approach
      const specCondition = `specifications->>'caseSize'`;
      
      // Extract numeric part for comparison (removes 'mm' if present)
      // This is a more reliable approach to filter by numeric value regardless of format
      query = query.or(`
        (${specCondition}::text ~ '^[0-9]+(\\.[0-9]+)?') AND 
        (regexp_replace(${specCondition}::text, '[^0-9\\.]', '', 'g')::numeric >= ${params.minCaseSize}) AND
        (regexp_replace(${specCondition}::text, '[^0-9\\.]', '', 'g')::numeric <= ${params.maxCaseSize})
      `);
      
      console.log('[API:products] Applied improved case size filter');
    } catch (error) {
      console.error('[API:products] Error applying case size filter:', error);
      // Log the error but continue without filtering if there's an issue
    }
  }
  return query;
};

// Re-export all other watch filter functions from original file
export { 
  applyBandFilter, 
  applyCaseColorFilter, 
  applyColorFilter
} from './filters/watchFilters.ts';
