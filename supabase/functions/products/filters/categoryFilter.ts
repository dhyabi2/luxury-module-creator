
// Category filter implementation
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
