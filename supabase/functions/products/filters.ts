
// Apply brand filter
export const applyBrandFilter = (query: any, params: any) => {
  if (params.brand) {
    const brands = params.brand.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by brands: ${brands.join(', ')}`);
    query = query.in('brand', brands);
  }
  return query;
};

// Apply category filter
export const applyCategoryFilter = (query: any, params: any) => {
  if (params.category) {
    const categories = params.category.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by categories: ${categories.join(', ')}`);
    query = query.in('category', categories);
  }
  return query;
};

// Apply gender filter
export const applyGenderFilter = (query: any, params: any) => {
  if (params.gender) {
    const genders = params.gender.split(',').map((g: string) => g.trim());
    console.log(`[API:products] Filtering by genders: ${genders.join(', ')}`);
    
    if (genders.length > 0) {
      const genderFilter = {};
      genderFilter['gender'] = genders[0];
      
      // Use containedBy for JSONB which is more reliable
      query = query.containedBy('specifications', genderFilter);
      
      // For multiple genders, add OR conditions
      if (genders.length > 1) {
        let orConditions = [];
        for (let i = 1; i < genders.length; i++) {
          const additionalFilter = {};
          additionalFilter['gender'] = genders[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
        }
      }
    }
  }
  return query;
};

// Apply price range filter
export const applyPriceFilter = (query: any, params: any) => {
  if (params.minPrice && params.maxPrice) {
    console.log(`[API:products] Filtering by price range: $${params.minPrice} - $${params.maxPrice}`);
    query = query.gte('price', parseFloat(params.minPrice))
             .lte('price', parseFloat(params.maxPrice));
  }
  return query;
};

// Apply case size filter
export const applyCaseSizeFilter = (query: any, params: any) => {
  if (params.minCaseSize && params.maxCaseSize) {
    console.log(`[API:products] Filtering by case size: ${params.minCaseSize}mm - ${params.maxCaseSize}mm`);
    
    const minSize = parseInt(params.minCaseSize);
    const maxSize = parseInt(params.maxCaseSize);
    
    let sizeConditions = [];
    for (let size = minSize; size <= maxSize; size++) {
      sizeConditions.push(`specifications::text ilike '%"caseSize":"${size}mm"%'`);
      sizeConditions.push(`specifications::text ilike '%"caseSize": "${size}mm"%'`);
    }
    
    if (sizeConditions.length > 0) {
      query = query.or(sizeConditions.join(','));
    }
  }
  return query;
};

// Apply band material filter
export const applyBandFilter = (query: any, params: any) => {
  if (params.band) {
    const bands = params.band.split(',').map((b: string) => b.trim());
    console.log(`[API:products] Filtering by band materials: ${bands.join(', ')}`);
    
    if (bands.length > 0) {
      const bandFilter = {};
      bandFilter['strapMaterial'] = bands[0];
      
      // Use containedBy for JSONB
      query = query.containedBy('specifications', bandFilter);
      
      // For multiple bands, add OR conditions
      if (bands.length > 1) {
        let orConditions = [];
        for (let i = 1; i < bands.length; i++) {
          const additionalFilter = {};
          additionalFilter['strapMaterial'] = bands[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
        }
      }
    }
  }
  return query;
};

// Apply case color filter
export const applyCaseColorFilter = (query: any, params: any) => {
  if (params.caseColor) {
    const caseColors = params.caseColor.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by case colors: ${caseColors.join(', ')}`);
    
    if (caseColors.length > 0) {
      const caseColorFilter = {};
      caseColorFilter['caseMaterial'] = caseColors[0];
      
      // Use containedBy for JSONB
      query = query.containedBy('specifications', caseColorFilter);
      
      // For multiple case colors, add OR conditions
      if (caseColors.length > 1) {
        let orConditions = [];
        for (let i = 1; i < caseColors.length; i++) {
          const additionalFilter = {};
          additionalFilter['caseMaterial'] = caseColors[i];
          orConditions.push(`specifications::jsonb @> '${JSON.stringify(additionalFilter)}'`);
        }
        
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(','));
        }
      }
    }
  }
  return query;
};

// Apply dial/strap color filter
export const applyColorFilter = (query: any, params: any) => {
  if (params.color) {
    const colors = params.color.split(',').map((c: string) => c.trim());
    console.log(`[API:products] Filtering by colors: ${colors.join(', ')}`);
    
    if (colors.length > 0) {
      let colorConditions = [];
      
      for (let i = 0; i < colors.length; i++) {
        colorConditions.push(`specifications::text ilike '%"dialColor":"${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"strapColor":"${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"dialColor": "${colors[i]}"%'`);
        colorConditions.push(`specifications::text ilike '%"strapColor": "${colors[i]}"%'`);
      }
      
      if (colorConditions.length > 0) {
        query = query.or(colorConditions.join(','));
      }
    }
  }
  return query;
};

// Apply special filters (new arrivals, sale)
export const applySpecialFilters = (query: any, params: any) => {
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
  
  return query;
};

// Apply all filters to a query
export const applyAllFilters = (query: any, params: any) => {
  console.log('[API:products] Building Supabase query with filters');
  
  query = applyBrandFilter(query, params);
  query = applyCategoryFilter(query, params);
  query = applyGenderFilter(query, params);
  query = applyPriceFilter(query, params);
  query = applyCaseSizeFilter(query, params);
  query = applyBandFilter(query, params);
  query = applyCaseColorFilter(query, params);
  query = applyColorFilter(query, params);
  query = applySpecialFilters(query, params);
  
  return query;
};
