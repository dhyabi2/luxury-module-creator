
import { FiltersResponse } from '@/types/api';

/**
 * Fetch filters data from the edge function
 */
export async function fetchFiltersData(categoryParam?: string | string[]): Promise<FiltersResponse> {
  console.log('Fetching filters data from API...');
  
  // Direct API call to the edge function
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
  
  const categoryQueryParam = categoryParam ? 
    (Array.isArray(categoryParam) ? categoryParam.join(',') : categoryParam) : '';
  
  const queryString = categoryQueryParam ? `?category=${categoryQueryParam}` : '';
  const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${queryString}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!response.ok) {
    console.error('Failed to fetch filters:', response.status, response.statusText);
    throw new Error(`Failed to fetch filters: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Filter data received:', Object.keys(data));
  return data;
}
