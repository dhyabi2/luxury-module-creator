
// Price filter implementation
export const applyPriceFilter = (query: any, params: any) => {
  if (params.minPrice && params.maxPrice) {
    console.log(`[API:products] Filtering by price range: $${params.minPrice} - $${params.maxPrice}`);
    query = query.gte('price', parseFloat(params.minPrice))
             .lte('price', parseFloat(params.maxPrice));
  } else {
    console.log('[API:products] No price range filter applied');
  }
  return query;
};
