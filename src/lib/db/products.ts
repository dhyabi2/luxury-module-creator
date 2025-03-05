
import { supabase } from "@/integrations/supabase/client";

// Database operations for products
export const productsDb = {
  getAll: async (filters: any = {}, pagination: any = {}, sorting: any = {}) => {
    console.log('[DB:products] Getting products with filters:', filters);
    console.log('[DB:products] Pagination:', pagination);
    console.log('[DB:products] Sorting:', sorting);
    
    try {
      // Start building the query
      let query = supabase.from('products').select('*', { count: 'exact' });
      console.log('[DB:products] Starting Supabase query build');
      
      // Apply brand filter - can be single brand or comma-separated list
      if (filters.brand && filters.brand.trim() !== '') {
        if (filters.brand.includes(',')) {
          const brands = filters.brand.split(',').map((b: string) => b.trim());
          console.log(`[DB:products] Applying multiple brands filter: ${brands.join(', ')}`);
          query = query.in('brand', brands);
        } else {
          console.log(`[DB:products] Applying single brand filter: ${filters.brand}`);
          query = query.ilike('brand', filters.brand);
        }
      }
      
      // Apply category filter - can be single category or comma-separated list
      if (filters.category && filters.category.trim() !== '') {
        if (filters.category.includes(',')) {
          const categories = filters.category.split(',').map((c: string) => c.trim().toLowerCase());
          console.log(`[DB:products] Applying multiple categories filter: ${categories.join(', ')}`);
          query = query.in('category', categories);
        } else {
          console.log(`[DB:products] Applying single category filter: ${filters.category}`);
          query = query.eq('category', filters.category.toLowerCase());
        }
      }
      
      // Apply price range filter if provided
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        console.log(`[DB:products] Applying price range filter: ${filters.minPrice}-${filters.maxPrice}`);
        query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);
      }
      
      // Apply case size filter - fixed to use correct Postgres JSON syntax
      if (filters.minCaseSize !== undefined || filters.maxCaseSize !== undefined) {
        console.log(`[DB:products] Applying case size filter: ${filters.minCaseSize || 'min'}-${filters.maxCaseSize || 'max'}`);
        // First ensure specifications is not null
        let caseSizeQuery = query.not('specifications', 'is', null);
        
        // Create a new query to avoid TypeScript's excessive type instantiation depth error
        if (filters.minCaseSize !== undefined) {
          console.log(`[DB:products] Building minimum case size query: >= ${filters.minCaseSize}mm`);
          query = supabase.from('products')
            .select('*', { count: 'exact' })
            .not('specifications', 'is', null)
            .gte('specifications->>caseSize', `${filters.minCaseSize}mm`);
            
          // Re-apply previous filters
          if (filters.brand && filters.brand.trim() !== '') {
            if (filters.brand.includes(',')) {
              const brands = filters.brand.split(',').map((b: string) => b.trim());
              query = query.in('brand', brands);
            } else {
              query = query.ilike('brand', filters.brand);
            }
          }
          
          if (filters.category && filters.category.trim() !== '') {
            if (filters.category.includes(',')) {
              const categories = filters.category.split(',').map((c: string) => c.trim().toLowerCase());
              query = query.in('category', categories);
            } else {
              query = query.eq('category', filters.category.toLowerCase());
            }
          }
          
          if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);
          }
        }
        
        if (filters.maxCaseSize !== undefined) {
          console.log(`[DB:products] Applying maximum case size filter: <= ${filters.maxCaseSize}mm`);
          query = query.lte('specifications->>caseSize', `${filters.maxCaseSize}mm`);
        }
      }
      
      // Apply band filter
      if (filters.band && filters.band.trim() !== '') {
        const bands = filters.band.split(',').map((b: string) => b.trim());
        console.log(`[DB:products] Applying band material filter: ${bands.join(', ')}`);
        query = query.contains('specifications', { strapMaterial: bands[0] });
        
        // If more than one band material, use OR conditions for each additional one
        if (bands.length > 1) {
          console.log(`[DB:products] Applying multiple band material conditions`);
          for (let i = 1; i < bands.length; i++) {
            query = query.or(`specifications->strapMaterial.eq.${bands[i]}`);
          }
        }
      }
      
      // Apply case color filter
      if (filters.caseColor && filters.caseColor.trim() !== '') {
        const colors = filters.caseColor.split(',').map((c: string) => c.trim());
        console.log(`[DB:products] Applying case material filter: ${colors.join(', ')}`);
        query = query.contains('specifications', { caseMaterial: colors[0] });
        
        // If more than one case color, use OR conditions for each additional one
        if (colors.length > 1) {
          console.log(`[DB:products] Applying multiple case material conditions`);
          for (let i = 1; i < colors.length; i++) {
            query = query.or(`specifications->caseMaterial.eq.${colors[i]}`);
          }
        }
      }
      
      // Apply color filter (for both dial and strap)
      if (filters.color && filters.color.trim() !== '') {
        const colors = filters.color.split(',').map((c: string) => c.trim());
        let colorConditions = [];
        console.log(`[DB:products] Applying color filter: ${colors.join(', ')}`);
        
        // Build conditions for each color and each field
        for (const color of colors) {
          colorConditions.push(`specifications->dialColor.eq.${color}`);
          colorConditions.push(`specifications->strapColor.eq.${color}`);
        }
        
        console.log(`[DB:products] Color filter conditions: ${colorConditions.join(' OR ')}`);
        query = query.or(colorConditions.join(','));
      }
      
      // Execute count query first
      console.log('[DB:products] Executing count query');
      const { count, error: countError } = await query;
      
      if (countError) {
        console.error('[DB:products] Error getting product count:', countError);
        throw countError;
      }
      
      console.log(`[DB:products] Count query returned: ${count} products`);
      
      if (!count) {
        console.warn('[DB:products] No products found matching the criteria');
        return {
          products: [],
          pagination: {
            totalCount: 0,
            totalPages: 0,
            currentPage: pagination.page || 1,
            pageSize: pagination.pageSize || 8
          }
        };
      }
      
      // Apply sorting
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
      
      // Apply pagination
      if (pagination.page && pagination.pageSize) {
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        console.log(`[DB:products] Applying pagination: page ${pagination.page}, size ${pagination.pageSize}, range ${startIndex}-${startIndex + pagination.pageSize - 1}`);
        query = query.range(startIndex, startIndex + pagination.pageSize - 1);
      }
      
      // Execute the data query
      console.log('[DB:products] Executing data query');
      const { data: products, error } = await query;
      
      if (error) {
        console.error('[DB:products] Error fetching products:', error);
        throw error;
      }
      
      console.log(`[DB:products] Data query returned: ${products?.length || 0} products`);
      
      if (!products || products.length === 0) {
        console.warn('[DB:products] No products returned from database');
        return {
          products: [],
          pagination: {
            totalCount: count,
            totalPages: Math.ceil(count / (pagination.pageSize || 8)),
            currentPage: pagination.page || 1,
            pageSize: pagination.pageSize || 8
          }
        };
      }
      
      // Ensure all products have valid image URLs
      console.log('[DB:products] Processing products data');
      const processedProducts = products.map(product => {
        // Validate image URL
        if (!product.image || !product.image.startsWith('http')) {
          // Set fallback image if missing or invalid
          console.log(`[DB:products] Replacing invalid image for product ${product.id}`);
          return {
            ...product,
            image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8'
          };
        }
        return product;
      });
      
      // Apply client-side sorting for price cases
      let sortedProducts = [...processedProducts];
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
      
      console.log(`[DB:products] Returned ${sortedProducts.length} products after processing`);
      
      return {
        products: sortedProducts,
        pagination: {
          totalCount: count,
          totalPages: Math.ceil(count / (pagination.pageSize || 8)),
          currentPage: pagination.page || 1,
          pageSize: pagination.pageSize || 8
        }
      };
    } catch (error) {
      console.error('[DB:products] Error in productsDb.getAll:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    console.log(`DB: Getting product with id: ${id}`);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
      }
      
      // Validate image URL for single product
      if (data && (!data.image || !data.image.startsWith('http'))) {
        data.image = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8';
      }
      
      return data;
    } catch (error) {
      console.error(`Error in productsDb.getById for id ${id}:`, error);
      throw error;
    }
  }
};
