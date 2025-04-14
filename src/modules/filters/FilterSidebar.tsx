
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import FilterHeader from './components/FilterHeader';
import FilterSidebarContent from './components/FilterSidebarContent';
import { defaultFilters } from '../../lib/db/filters/defaultValues';
import { FiltersResponse } from '@/types/api';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  categoryParam?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange,
  initialFilters = {},
  categoryParam
}) => {
  // State for filters data and loading
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiRequestCompleted = useRef(false);
  
  // Filter state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(
    initialFilters.selectedOptions || {}
  );
  const [priceRange, setPriceRange] = useState(
    initialFilters.priceRange || { min: 0, max: 1000 }
  );
  const [caseSizeRange, setCaseSizeRange] = useState(
    initialFilters.caseSizeRange || { min: 20, max: 45 }
  );
  
  const selectedCategories = initialFilters.categories || 
    (categoryParam ? [categoryParam] : []);
  const activeCategoryName = categoryParam || '';
  
  // Categories that have brand info
  const [categorySpecificBrands, setCategorySpecificBrands] = useState<Record<string, any[]>>({});
  
  // Fetch filters data only once on component mount
  useEffect(() => {
    // Skip if we already made the request
    if (apiRequestCompleted.current) return;
    
    const fetchFiltersData = async () => {
      setIsLoading(true);
      apiRequestCompleted.current = true; // Mark as completed immediately to prevent duplicate requests
      
      try {
        // Direct API call to the edge function
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const categoryQueryParam = selectedCategories.length > 0 ? 
          selectedCategories.join(',') : '';
        
        const queryString = categoryQueryParam ? `?category=${categoryQueryParam}` : '';
        console.log(`[FilterSidebar] Fetching filters data with query: ${queryString}`);
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${queryString}`, {
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
          
          // Extract category-specific brands if available
          if (data && data.categoryBrands) {
            setCategorySpecificBrands(data.categoryBrands);
          }
          
          // Initialize price range from data
          if (data && data.priceRange) {
            setPriceRange(data.priceRange);
          }
          
          // Initialize case size range from data
          if (data && data.caseSizeRange) {
            setCaseSizeRange(data.caseSizeRange);
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
  }, []); // Empty dependency array to run only once
  
  // Handle filter changes and call the parent component's callback
  useEffect(() => {
    if (onFilterChange) {
      const currentFilters = {
        selectedOptions,
        priceRange,
        caseSizeRange,
        categories: selectedOptions.categories || []
      };
      onFilterChange(currentFilters);
    }
  }, [selectedOptions, priceRange, caseSizeRange, onFilterChange]);
  
  // Handle option selection change
  const handleSelectionChange = (filterType: string, values: string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [filterType]: values
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  // Handle case size range change
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    setCaseSizeRange({ min, max });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedOptions({});
    
    // Reset price range to the default or initial data
    if (filtersData && filtersData.priceRange) {
      setPriceRange(filtersData.priceRange);
    } else if (initialFilters.priceRange) {
      setPriceRange(initialFilters.priceRange);
    }
    
    // Reset case size range to the default or initial data
    if (filtersData && filtersData.caseSizeRange) {
      setCaseSizeRange(filtersData.caseSizeRange);
    } else if (initialFilters.caseSizeRange) {
      setCaseSizeRange(initialFilters.caseSizeRange);
    }
  };
  
  // Handler for clearing filters with toast notification
  const handleClearFiltersWithNotification = () => {
    handleClearFilters();
    toast.success('Filters cleared');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={handleClearFiltersWithNotification} />
      
      <FilterSidebarContent
        filtersData={filtersData}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        priceRange={priceRange}
        caseSizeRange={caseSizeRange}
        handleSelectionChange={handleSelectionChange}
        handlePriceRangeChange={handlePriceRangeChange}
        handleCaseSizeRangeChange={handleCaseSizeRangeChange}
        categorySpecificBrands={categorySpecificBrands}
        activeCategoryName={activeCategoryName}
      />
    </div>
  );
};

export default FilterSidebar;
