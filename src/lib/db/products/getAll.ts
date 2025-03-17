
import { supabase } from "@/integrations/supabase/client";
import { applyFilters } from './filters';
import { applySorting } from './sorting';
import { processPagination } from './pagination';
import { processProducts } from './processor';

/**
 * Get all products with optional filtering, pagination, and sorting
 * 
 * @param filters - Filter criteria for products
 * @param pagination - Pagination parameters
 * @param sorting - Sorting parameters
 * @returns Filtered, paginated, and sorted products with pagination metadata
 */
export const getAll = async (filters: any = {}, pagination: any = {}, sorting: any = {}) => {
  console.log('[DB:products] Getting products with filters:', filters);
  console.log('[DB:products] Pagination:', pagination);
  console.log('[DB:products] Sorting:', sorting);
  
  try {
    // Start building the query
    let query = supabase.from('products').select('*', { count: 'exact' });
    console.log('[DB:products] Starting Supabase query build');
    
    // Apply all filters to the query
    query = applyFilters(query, filters);
    
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
    query = applySorting(query, sorting);
    
    // Apply pagination
    query = processPagination(query, pagination);
    
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
    
    // Process products (validate images, etc)
    const processedProducts = processProducts(products);
    
    // Apply client-side sorting for price cases
    let sortedProducts = applySorting.clientSide(processedProducts, sorting);
    
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
};
