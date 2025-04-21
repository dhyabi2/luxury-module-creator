
// Special filters implementation with improved error logging
export const applySpecialFilters = (query: any, params: any) => {
  try {
    // New arrivals filter
    if (params.isNewIn === 'true') {
      console.log('[API:products] Filtering by new arrivals');
      // Simulate new items by getting latest IDs
      query = query.order('id', { ascending: false }).limit(50);
    }
    
    // Sale items filter
    if (params.isOnSale === 'true') {
      console.log('[API:products] Filtering by sale items');
      query = query.gt('discount', 0);
    }

    // In-stock filter
    if (params.instock === 'true') {
      console.log('[API:products] Filtering for in-stock items');
      query = query.gt('stock', 0);
    }
    
    // Clearance filter
    if (params.clearance === 'true') {
      console.log('[API:products] Filtering for clearance items');
      query = query.gt('discount', 0);
    }
    
    return query;
  } catch (error) {
    // Log the raw error with full details
    console.error('[API:products] Error in special filters:', error);
    console.error('[API:products] Error details:', JSON.stringify({
      message: error.message,
      name: error.name,
      stack: error.stack,
      params: params
    }));
    
    // Rethrow to let error bubble up without handling
    throw error;
  }
};
