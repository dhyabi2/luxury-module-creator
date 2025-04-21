
export const handleQueryError = (error: any, origin: string) => {
  console.error(`[API:products] ${origin} error:`, error);
  return new Response(
    JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range, cache-control',
      }
    }
  );
};

export const handleSimplifiedQuery = async (supabase: any, params: any, page: number, pageSize: number) => {
  console.log('[API:products] Executing simplified query');
  let query = supabase.from('products')
    .select('*', { count: 'exact' });

  // Add basic filters
  if (params.category) {
    query = query.ilike('category', `%${params.category}%`);
  }

  // Apply instock filter if present
  if (params.instock === 'true') {
    query = query.gt('stock', 0);
  }

  // Apply clearance filter if present
  if (params.clearance === 'true') {
    query = query.gt('discount', 0);
  }

  const { count } = await query;
  
  // Apply pagination to get the actual data
  const { data: products, error } = await query
    .order('id', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;

  return { products, count };
};
