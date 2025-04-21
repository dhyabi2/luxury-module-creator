
// Special filters implementation (clearance, in-stock, etc.)
export const applySpecialFilters = (query: any, params: any) => {
  console.log('[API:products] Applying special filters:', params);

  // Apply stock filter - items in stock
  if (params.instock === 'true') {
    console.log('[API:products] Filtering for in stock items');
    query = query.gt('stock', 0);
  }
  
  // Apply clearance filter - items with discount
  if (params.clearance === 'true') {
    console.log('[API:products] Filtering for clearance items');
    query = query.gt('discount', 0);
  }
  
  // Apply new arrival filter
  if (params.newArrival === 'true' || params.isNewIn === 'true') {
    console.log('[API:products] Filtering for new arrivals');
    // For demo purposes, consider items added in the last 30 days as new
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte('created_at', thirtyDaysAgo.toISOString());
  }
  
  // Apply on sale filter
  if (params.onSale === 'true' || params.isOnSale === 'true') {
    console.log('[API:products] Filtering for sale items');
    query = query.gt('discount', 0);
  }
  
  return query;
};
