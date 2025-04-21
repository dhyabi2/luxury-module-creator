
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { defaultFilters } from '../../../lib/db/filters/defaultValues';
import { FiltersResponse } from '@/types/api';

interface UseFilterSidebarStateProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  categoryParam?: string;
}

export function useFilterSidebarState({ 
  onFilterChange, 
  initialFilters = {}, 
  categoryParam 
}: UseFilterSidebarStateProps) {
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(
    initialFilters.selectedOptions || {}
  );
  const [priceRange, setPriceRange] = useState(
    initialFilters.priceRange || { min: 0, max: 1000 }
  );
  
  // Fetch filters data on component mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      setIsLoading(true);
      
      try {
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const categoryQueryParam = selectedOptions.categories?.length > 0 ? 
          selectedOptions.categories.join(',') : '';
        
        const queryString = categoryQueryParam ? `?category=${categoryQueryParam}` : '';
        console.log(`[FilterSidebar] Fetching filters data with query: ${queryString}`);
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${queryString}`, {
          method: 'GET',
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch filters:', response.status, response.statusText);
          setFiltersData(defaultFilters);
        } else {
          const data = await response.json();
          console.log('Filter data received:', data);
          setFiltersData(data || defaultFilters);
          
          if (data && data.priceRange) {
            console.log('Setting price range from filters data:', data.priceRange);
            setPriceRange({
              min: data.priceRange.min,
              max: data.priceRange.max
            });
          }
        }
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
  }, [selectedOptions.categories]);
  
  // Update filters when selection changes
  useEffect(() => {
    if (onFilterChange) {
      const currentFilters = {
        selectedOptions,
        priceRange,
        categories: selectedOptions.categories || []
      };
      onFilterChange(currentFilters);
      sendFilterSelection(currentFilters);
    }
  }, [selectedOptions, priceRange, onFilterChange]);
  
  const sendFilterSelection = async (filters: Record<string, any>) => {
    try {
      const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
      
      const queryParams = new URLSearchParams();
      
      if (filters.selectedOptions?.brands?.length > 0) {
        queryParams.append('brand', filters.selectedOptions.brands.join(','));
      }
      
      if (filters.selectedOptions?.categories?.length > 0) {
        queryParams.append('category', filters.selectedOptions.categories.join(','));
      }
      
      if (filters.selectedOptions?.genders?.length > 0) {
        queryParams.append('gender', filters.selectedOptions.genders.join(','));
      }
      
      if (filters.selectedOptions?.bands?.length > 0) {
        queryParams.append('band', filters.selectedOptions.bands.join(','));
      }
      
      if (filters.selectedOptions?.caseColors?.length > 0) {
        queryParams.append('caseColor', filters.selectedOptions.caseColors.join(','));
      }
      
      if (filters.selectedOptions?.colors?.length > 0) {
        queryParams.append('color', filters.selectedOptions.colors.join(','));
      }
      
      if (filters.priceRange?.min !== undefined) {
        queryParams.append('minPrice', filters.priceRange.min.toString());
      }
      
      if (filters.priceRange?.max !== undefined) {
        queryParams.append('maxPrice', filters.priceRange.max.toString());
      }
      
      if (filters.selectedOptions?.instock?.includes('instock')) {
        queryParams.append('instock', 'true');
      }
      
      if (filters.selectedOptions?.clearance?.includes('clearance')) {
        queryParams.append('clearance', 'true');
      }
      
      console.log('Sending filter selection to API:', queryParams.toString());
      
      await fetch(`${SUPABASE_URL}/functions/v1/filter-products?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error('Error sending filter selection:', error);
    }
  };
  
  const handleClearFilters = () => {
    setSelectedOptions({});
    if (filtersData && filtersData.priceRange) {
      setPriceRange(filtersData.priceRange);
    }
  };
  
  return {
    filtersData,
    isLoading,
    selectedOptions,
    priceRange,
    handleClearFilters,
    setSelectedOptions,
    setPriceRange,
  };
}

