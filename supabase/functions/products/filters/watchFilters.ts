
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
      const minSize = parseFloat(params.minCaseSize);
      const maxSize = parseFloat(params.maxCaseSize);
      
      // Extract numeric part for comparison (removes 'mm' if present)
      // This is a more reliable approach to filter by numeric value regardless of format
      query = query.or(`
        (specifications->>'caseSize' ~ '^[0-9]+(\\.[0-9]+)?(mm)?$') AND 
        (CAST(regexp_replace(specifications->>'caseSize', '[^0-9\\.]', '', 'g') AS numeric) >= ${minSize}) AND
        (CAST(regexp_replace(specifications->>'caseSize', '[^0-9\\.]', '', 'g') AS numeric) <= ${maxSize})
      `);
      
      console.log('[API:products] Applied improved case size filter with regex extraction');
    } catch (error) {
      console.error('[API:products] Error applying case size filter:', error);
      // Continue without filtering if there's an issue
    }
  }
  return query;
};

// Re-export all other watch filter functions
export { 
  applyBandFilter, 
  applyCaseColorFilter, 
  applyColorFilter
} from '../filters.ts'; // Fix the import path
