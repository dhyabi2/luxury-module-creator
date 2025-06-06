
import { toast } from 'sonner';
import { FiltersResponse } from '@/types/api';
import { buildFilterParams } from '../utils/filterParamsBuilder';

export const fetchFiltersData = async (categoryParam?: string): Promise<FiltersResponse | null> => {
  console.log('[FilterService] Fetching filters data with category:', categoryParam);
  
  try {
    const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
    
    const params = buildFilterParams({ categoryParam });
    const queryString = params.toString();
    console.log(`[FilterService] Query string: ${queryString}`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${queryString ? `?${queryString}` : ''}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch filters: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[FilterService] Filters data received:', data);
    return data;
  } catch (error) {
    console.error('[FilterService] Error:', error);
    toast.error('Failed to load filters', {
      description: 'Using default filters instead'
    });
    return null;
  }
};

export const sendFilterSelection = async (filters: Record<string, any>) => {
  try {
    const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
    
    const params = buildFilterParams(filters);
    const queryString = params.toString();
    console.log('[FilterService] Sending filter selection:', queryString);
    
    await fetch(`${SUPABASE_URL}/functions/v1/filter-products?${queryString}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('[FilterService] Error sending filter selection:', error);
  }
};
