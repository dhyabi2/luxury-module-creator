
// Category filter implementation with improved handling
export const applyCategoryFilter = (query: any, params: any) => {
  if (params.category) {
    const categories = params.category.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
    
    // If "all" is included or empty, don't filter by category
    if (categories.includes('all') || categories.length === 0) {
      console.log('[API:products] Skipping category filter due to "all" selection');
      return query;
    }
    
    // Use exact match for better filtering
    if (categories.length === 1) {
      console.log(`[API:products] Single category filter: ${categories[0]}`);
      query = query.eq('category', categories[0].toLowerCase());
    } else {
      // For multiple categories, use IN operator
      console.log(`[API:products] Multiple categories filter: ${categories.join(', ')}`);
      query = query.in('category', categories.map(c => c.toLowerCase()));
    }
  }
  
  // Handle the categories param (from FilterSidebar)
  if (params.categories && !params.category) {
    const categories = params.categories.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories param: ${categories.join(', ')}`);
    
    if (categories.includes('all') || categories.length === 0) {
      console.log('[API:products] Skipping categories filter due to "all" selection');
      return query;
    }
    
    if (categories.length === 1) {
      console.log(`[API:products] Single categories filter: ${categories[0]}`);
      query = query.eq('category', categories[0].toLowerCase());
    } else {
      console.log(`[API:products] Multiple categories filter: ${categories.join(', ')}`);
      query = query.in('category', categories.map(c => c.toLowerCase()));
    }
  }
  
  return query;
};
