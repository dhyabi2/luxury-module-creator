
import { supabase } from "@/integrations/supabase/client";

// Database operations for products
export const productsDb = {
  getAll: async (filters: any = {}, pagination: any = {}, sorting: any = {}) => {
    console.log('DB: Getting products with filters:', filters);
    
    try {
      // Start building the query
      let query = supabase.from('products').select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.brand) {
        query = query.ilike('brand', filters.brand);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category.toLowerCase());
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
      
      if (!products) {
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
      
      // Apply client-side sorting for price cases
      let sortedProducts = [...products];
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
      
      return data;
    } catch (error) {
      console.error(`Error in productsDb.getById for id ${id}:`, error);
      throw error;
    }
  }
};
