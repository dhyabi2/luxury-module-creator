import { supabase } from "@/integrations/supabase/client";

// Database connection utility
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
