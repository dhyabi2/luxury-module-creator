
// NOTE: This hook is kept for reference but not used anymore.
// Direct API calls are used in FilterSidebar.tsx instead to avoid excessive API requests.

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { FiltersResponse } from '@/types/api';
import { defaultFilters } from '@/lib/db/filters/defaultValues';

export function useFiltersData(selectedCategories: string[], categoryParam?: string) {
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestMadeRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple requests being made
    if (requestMadeRef.current) return;
    
    const fetchFiltersData = async () => {
      setIsLoading(true);
      requestMadeRef.current = true;
      
      try {
        // Direct API call to the edge function
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const categoryQueryParam = selectedCategories.length > 0 ? 
          selectedCategories.join(',') : '';
        
        const queryString = categoryQueryParam ? `?category=${categoryQueryParam}` : '';
        
        console.log(`[useFiltersData] Making single API request with query: ${queryString}`);
        const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${queryString}`, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch filters:', response.status, response.statusText);
          throw new Error(`Failed to fetch filters: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Filter data received:', data);
        setFiltersData(data);
        
      } catch (error) {
        console.error('Error fetching filters:', error);
        setFiltersData(defaultFilters);
        toast.error('Failed to load filters', {
          description: 'Using default filters instead'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiltersData();
  }, []); // Empty dependency array to only run once
  
  return { filtersData, isLoading };
}
