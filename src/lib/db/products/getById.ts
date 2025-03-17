
import { supabase } from "@/integrations/supabase/client";

/**
 * Get a single product by its ID
 * 
 * @param id - Product ID to fetch
 * @returns The product data or throws an error
 */
export const getById = async (id: string) => {
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
};
