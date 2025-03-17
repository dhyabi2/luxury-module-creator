
/**
 * Apply sorting to the query
 * 
 * @param query - The Supabase query to modify
 * @param sorting - The sorting parameters
 * @returns The modified query with sorting applied
 */
export const applySorting = (query: any, sorting: { sortBy?: string }) => {
  if (sorting.sortBy) {
    console.log(`[DB:products] Sorting products by ${sorting.sortBy}`);
    
    switch (sorting.sortBy) {
      case 'price-low':
        // For discounted items, we'll sort after fetching
        console.log('[DB:products] Using client-side sorting for price-low');
        break;
      case 'price-high':
        // For discounted items, we'll sort after fetching
        console.log('[DB:products] Using client-side sorting for price-high');
        break;
      case 'newest':
        console.log('[DB:products] Applying server-side sorting for newest');
        query = query.order('id', { ascending: false });
        break;
      default:
        // 'featured' - no special sorting, use default order
        console.log('[DB:products] Using default sorting (featured)');
        break;
    }
  }
  
  return query;
};

/**
 * Client-side sorting for special cases like discounted prices
 * 
 * @param products - The products to sort
 * @param sorting - The sorting parameters
 * @returns The sorted products
 */
applySorting.clientSide = (products: any[], sorting: { sortBy?: string }) => {
  let sortedProducts = [...products];
  
  if (sorting.sortBy === 'price-low') {
    console.log('[DB:products] Applying client-side sorting for price-low');
    sortedProducts.sort((a: any, b: any) => {
      const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
      const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
      return priceA - priceB;
    });
  } else if (sorting.sortBy === 'price-high') {
    console.log('[DB:products] Applying client-side sorting for price-high');
    sortedProducts.sort((a: any, b: any) => {
      const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
      const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
      return priceB - priceA;
    });
  }
  
  return sortedProducts;
};
