
/**
 * Apply pagination to the query
 * 
 * @param query - The Supabase query to modify
 * @param pagination - The pagination parameters
 * @returns The modified query with pagination applied
 */
export const processPagination = (query: any, pagination: { page?: number; pageSize?: number }) => {
  if (pagination.page && pagination.pageSize) {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    console.log(`[DB:products] Applying pagination: page ${pagination.page}, size ${pagination.pageSize}, range ${startIndex}-${startIndex + pagination.pageSize - 1}`);
    query = query.range(startIndex, startIndex + pagination.pageSize - 1);
  }
  
  return query;
};
