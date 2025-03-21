
import { supabase } from '@/integrations/supabase/client';

export const updateLogo = async () => {
  console.log('[API:logo] Calling updateLogo edge function');
  
  try {
    const { data, error } = await supabase.functions.invoke('update-logo');
    
    if (error) {
      console.error('[API:logo] Error calling update-logo function:', error);
      throw error;
    }
    
    console.log('[API:logo] Logo updated successfully:', data);
    return data;
  } catch (error) {
    console.error('[API:logo] Unexpected error updating logo:', error);
    throw error;
  }
};
