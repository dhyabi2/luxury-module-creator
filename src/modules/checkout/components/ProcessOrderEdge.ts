
import { supabase } from '@/integrations/supabase/client';

// Direct edge function call without hooks
export const processOrderWithEdge = async (orderData: any) => {
  console.log('Processing order via edge function:', orderData);
  
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: orderData
    });
    
    if (error) {
      console.error('Error invoking edge function:', error);
      throw error;
    }
    
    console.log('Edge function response:', data);
    return data;
  } catch (error) {
    console.error('Failed to process order:', error);
    throw error;
  }
};
