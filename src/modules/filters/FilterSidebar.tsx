
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterHeader from './components/FilterHeader';
import FilterSidebarContent from './components/FilterSidebarContent';
import { getCombinedBrands, getActiveCategoryName } from './utils/brandUtils';

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
  // State management
  const [filtersData, setFiltersData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(initialFilters);
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.priceRange?.min || 0,
    max: initialFilters.priceRange?.max || 1225
  });
  const [caseSizeRange, setCaseSizeRange] = useState({
    min: initialFilters.caseSizeRange?.min || 20,
    max: initialFilters.caseSizeRange?.max || 45
  });
  
  // Calculate derived values
  const selectedCategories = selectedOptions.categories || [];
  
  // Get category-specific brands
  const getCategorySpecificBrands = () => {
    if (!filtersData || !filtersData.categoryBrands) {
      // If no filter data or no category brands, return all brands
      return filtersData?.brands || [];
    }
    
    if (selectedCategories.length === 0) {
      // If no categories selected, return all brands
      return filtersData.brands || [];
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      const result = filtersData.categoryBrands[categoryId] || [];
      console.log(`Getting brands for single category ${categoryId}:`, result.length);
      return result;
    } else {
      const result = getCombinedBrands(filtersData.categoryBrands, selectedCategories);
      console.log(`Getting combined brands for ${selectedCategories.length} categories:`, result.length);
      return result;
    }
  };
  
  const categorySpecificBrands = getCategorySpecificBrands();
  const activeCategoryName = getActiveCategoryName(selectedCategories);
  
  // Fetch filters data
  useEffect(() => {
    const getFiltersData = async () => {
      setIsLoading(true);
      try {
        // Direct API call to the edge function
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const categoryQueryParam = selectedCategories.length > 0 ? 
          selectedCategories.join(',') : '';
        
        const queryString = categoryQueryParam ? `?category=${categoryQueryParam}` : '';
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
        
        // Initialize ranges if not already set
        if (!initialFilters.priceRange && data.priceRange) {
          setPriceRange({
            min: data.priceRange.min,
            max: data.priceRange.max
          });
        }
        
        if (!initialFilters.caseSizeRange && data.caseSizeRange) {
          setCaseSizeRange({
            min: data.caseSizeRange.min,
            max: data.caseSizeRange.max
          });
        }
        
        // If there's a category parameter, add it to the selected categories
        if (categoryParam && !selectedCategories.includes(categoryParam)) {
          setSelectedOptions(prev => ({
            ...prev,
            categories: [...(prev.categories || []), categoryParam]
          }));
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
        toast.error('Failed to load filters', {
          description: 'Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getFiltersData();
  }, [selectedCategories]); // Refetch when categories change
  
  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      const filters = {
        ...selectedOptions,
        priceRange,
        caseSizeRange
      };
      console.log('Applying filters:', filters);
      onFilterChange(filters);
    }
  };
  
  // Apply filters when state changes
  useEffect(() => {
    applyFilters();
  }, [selectedOptions, priceRange, caseSizeRange]);
  
  // Handle selection change
  const handleSelectionChange = (category: string, selected: string[]) => {
    if (!category) {
      console.warn('Category name is required');
      return;
    }
    
    console.log(`Selection change for ${category}:`, selected);
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected || []
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
    
    if (filtersData) {
      if (filtersData.priceRange) {
        setPriceRange({
          min: filtersData.priceRange.min,
          max: filtersData.priceRange.max
        });
      }
      
      if (filtersData.caseSizeRange) {
        setCaseSizeRange({
          min: filtersData.caseSizeRange.min,
          max: filtersData.caseSizeRange.max
        });
      }
    }
    
    toast.success('Filters cleared');
  };
  
  // Debug brands information
  useEffect(() => {
    if (filtersData) {
      console.log('All brands count:', filtersData.brands?.length || 0);
      console.log('Category brands:', Object.keys(filtersData.categoryBrands || {}).length);
      console.log('Selected categories:', selectedCategories);
      console.log('Available brands for current selection:', categorySpecificBrands.length);
    }
  }, [filtersData, selectedCategories, categorySpecificBrands]);

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={handleClearFilters} />
      
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
