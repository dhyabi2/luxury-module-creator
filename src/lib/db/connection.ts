
import { supabase } from "@/integrations/supabase/client";

// Database connection utility
export const initializeDb = async () => {
  console.log('Initializing Supabase database connection...');
  
  try {
    // Test the connection by querying the products table
    const { data, count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (error) {
      throw error;
    }
    
    console.log(`Connected to Supabase database successfully, found ${count} products`);
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
