
// Gender filter implementation
export const applyGenderFilter = (query: any, params: any) => {
  // Check for standard gender parameter
  if (params.gender) {
    const genders = params.gender.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders (standard): ${genders.join(', ')}`);
    
    // If "all" is included or empty, don't filter by gender
    if (genders.includes('all') || genders.length === 0) {
      console.log('[API:products] Skipping gender filter due to "all" selection');
      return query;
    }
    
    if (genders.length > 0) {
      // Use text search for multiple genders which is more reliable
      const textConditions = [];
      for (const gender of genders) {
        textConditions.push(`specifications::text ilike '%"gender":"${gender}"%'`);
        textConditions.push(`specifications::text ilike '%"gender": "${gender}"%'`);
      }
      query = query.or(textConditions.join(','));
    }
    return query;
  }
  
  // Special handling for gender search parameter - this fixes the watches + gender issue
  if (params.genderSearch) {
    const genders = params.genderSearch.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders (text search): ${genders.join(', ')}`);
    
    // If "all" is included or empty, don't filter by gender
    if (genders.includes('all') || genders.length === 0) {
      console.log('[API:products] Skipping gender text search due to "all" selection');
      return query;
    }
    
    const watchesCategory = params.category && params.category.toLowerCase().includes('watches');
    
    if (genders.length > 0 && watchesCategory) {
      console.log('[API:products] Using optimized text search for watches + gender combination');
      
      // Direct text search on the JSON column as text
      const textConditions = [];
      for (const gender of genders) {
        // Add multiple variations to catch different JSON formats
        textConditions.push(`specifications::text ilike '%"gender":"${gender}"%'`);
        textConditions.push(`specifications::text ilike '%"gender": "${gender}"%'`);
      }
      
      if (textConditions.length > 0) {
        // Use OR for any gender match
        query = query.or(textConditions.join(','));
      }
    }
  }
  
  return query;
};
