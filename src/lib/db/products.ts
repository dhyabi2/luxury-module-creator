
import { supabase } from "@/integrations/supabase/client";

// Database operations for products
export const productsDb = {
  getAll: async (filters: any = {}, pagination: any = {}, sorting: any = {}) => {
    console.log('DB: Getting products with filters:', filters);
    
    try {
      // Start building the query
      let query = supabase.from('products').select('*', { count: 'exact' });
      
      // Apply brand filter - can be single brand or comma-separated list
      if (filters.brand && filters.brand.trim() !== '') {
        if (filters.brand.includes(',')) {
          const brands = filters.brand.split(',').map((b: string) => b.trim());
          query = query.in('brand', brands);
        } else {
          query = query.ilike('brand', filters.brand);
        }
      }
      
      // Apply category filter - can be single category or comma-separated list
      if (filters.category && filters.category.trim() !== '') {
        if (filters.category.includes(',')) {
          const categories = filters.category.split(',').map((c: string) => c.trim().toLowerCase());
          query = query.in('category', categories);
        } else {
          query = query.eq('category', filters.category.toLowerCase());
        }
      }
      
      // Apply price range filter if provided
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);
      }
      
      // Apply case size filter - requires use of JSON query capabilities
      if (filters.minCaseSize !== undefined && filters.maxCaseSize !== undefined) {
        // Extract numeric value from caseSize and filter
        query = query.or(`and(specifications->caseSize->isnot.null,specifications->caseSize.gte.${filters.minCaseSize}mm,specifications->caseSize.lte.${filters.maxCaseSize}mm)`);
      }
      
      // Apply band filter
      if (filters.band && filters.band.trim() !== '') {
        const bands = filters.band.split(',').map((b: string) => b.trim());
        query = query.or(`specifications->strapMaterial.in.(${bands.join(',')})`);
      }
      
      // Apply case color filter
      if (filters.caseColor && filters.caseColor.trim() !== '') {
        const colors = filters.caseColor.split(',').map((c: string) => c.trim());
        query = query.or(`specifications->caseMaterial.in.(${colors.join(',')})`);
      }
      
      // Apply color filter
      if (filters.color && filters.color.trim() !== '') {
        const colors = filters.color.split(',').map((c: string) => c.trim());
        query = query.or(`specifications->dialColor.in.(${colors.join(',')})`, `specifications->strapColor.in.(${colors.join(',')})`);
      }
      
      // Execute count query first
      const { count, error: countError } = await query;
      
      if (countError) {
        console.error('Error getting product count:', countError);
        throw countError;
      }
      
      if (!count) {
        console.warn('No products found matching the criteria');
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
        console.log(`DB: Sorting products by ${sorting.sortBy}`);
        
        switch (sorting.sortBy) {
          case 'price-low':
            // For discounted items, we'll sort after fetching
            break;
          case 'price-high':
            // For discounted items, we'll sort after fetching
            break;
          case 'newest':
            query = query.order('id', { ascending: false });
            break;
          default:
            // 'featured' - no special sorting, use default order
            break;
        }
      }
      
      // Apply pagination
      if (pagination.page && pagination.pageSize) {
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        query = query.range(startIndex, startIndex + pagination.pageSize - 1);
      }
      
      // Execute the data query
      const { data: products, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      if (!products || products.length === 0) {
        console.warn('No products returned from database');
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
      const processedProducts = products.map(product => {
        // Validate image URL
        if (!product.image || !product.image.startsWith('http')) {
          // Set fallback image if missing or invalid
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
        sortedProducts.sort((a: any, b: any) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceA - priceB;
        });
      } else if (sorting.sortBy === 'price-high') {
        sortedProducts.sort((a: any, b: any) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceB - priceA;
        });
      }
      
      console.log(`DB: Returned ${sortedProducts.length} products after processing`);
      
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
      console.error('Error in productsDb.getAll:', error);
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
