
// Database connection utility
// Using Supabase as the database backend

import { supabase } from "@/integrations/supabase/client";

// Database interface remains the same to maintain compatibility
export const initializeDb = async () => {
  console.log('Initializing Supabase database connection...');
  
  try {
    // Test the connection - using correct count syntax
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    console.log('Connected to Supabase database successfully');
    return {}; // Empty object as we don't need to store data in memory anymore
  } catch (error) {
    console.error('Failed to initialize Supabase database:', error);
    throw error;
  }
};

// Database singleton - keeping the pattern for backward compatibility
let dbInstance: any = null;

// Get or initialize the database
export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await initializeDb();
  }
  return dbInstance;
};

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
      const { count } = await query;
      
      if (!count) {
        throw new Error('Failed to get products count');
      }
      
      // Apply sorting
      if (sorting.sortBy) {
        console.log(`DB: Sorting products by ${sorting.sortBy}`);
        
        switch (sorting.sortBy) {
          case 'price-low':
            // For discounted items, we can't sort directly in the DB
            // We'll sort after fetching the data
            break;
          case 'price-high':
            // For discounted items, we can't sort directly in the DB
            // We'll sort after fetching the data
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
        throw new Error('No products returned from database');
      }
      
      // Apply client-side sorting for price cases
      if (sorting.sortBy === 'price-low') {
        products.sort((a: any, b: any) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceA - priceB;
        });
      } else if (sorting.sortBy === 'price-high') {
        products.sort((a: any, b: any) => {
          const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
          const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
          return priceB - priceA;
        });
      }
      
      return {
        products,
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

// Database operations for navigation
export const navigationDb = {
  getAll: async () => {
    console.log('DB: Getting all navigation data');
    
    try {
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .eq('type', 'all')
        .single();
      
      if (error) {
        console.error('Error fetching navigation data:', error);
        throw error;
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in navigationDb.getAll:', error);
      throw error;
    }
  }
};

// Database operations for filters
export const filtersDb = {
  getAll: async (category: string = '') => {
    console.log(`DB: Getting filters${category ? ` for category: ${category}` : ''}`);
    
    try {
      const { data, error } = await supabase
        .from('filters')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching filters data:', error);
        throw error;
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in filtersDb.getAll:', error);
      throw error;
    }
  }
};
