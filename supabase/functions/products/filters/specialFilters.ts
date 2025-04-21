
// Special filters implementation (clearance, in-stock, etc.)
export const applySpecialFilters = (query: any, params: any) => {
  // Apply stock filter
  if (params.instock === 'true') {
    console.log('[API:products] Filtering for in stock items');
    query = query.gt('stock', 0);
  }
  
  // Apply clearance filter
  if (params.clearance === 'true') {
    console.log('[API:products] Filtering for clearance items');
    query = query.gt('discount', 0);
  }
  
  return query;
};
