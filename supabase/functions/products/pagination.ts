
// Apply sorting based on parameters
export const applySorting = (query: any, sortBy: string) => {
  console.log(`[API:products] Sorting by: ${sortBy}`);
  
  if (sortBy === 'price-low') {
    query = query.order('price', { ascending: true });
  } else if (sortBy === 'price-high') {
    query = query.order('price', { ascending: false });
  } else if (sortBy === 'newest') {
    query = query.order('id', { ascending: false });
  } else {
    // Default sorting (featured)
    query = query.order('id', { ascending: true });
  }
  
  return query;
};

// Apply pagination
export const applyPagination = (query: any, page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  console.log(`[API:products] Applying pagination: items ${from} to ${to}`);
  return query.range(from, to);
};
