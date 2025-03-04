
import React, { useState, useEffect, useCallback } from 'react';
import FilterCategory from './FilterCategory';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
  unit: string;
}

interface FiltersData {
  priceRange: PriceRange;
  categories: FilterOption[];
  brands: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  caseSizeRange: {
    min: number;
    max: number;
    unit: string;
  };
}

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange,
  initialFilters = { brands: ['aigner'] }
}) => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>(initialFilters);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 1000 });
  const [caseSizeRange, setCaseSizeRange] = useState<{min: number, max: number}>({ min: 20, max: 45 });
  const [pendingFilters, setPendingFilters] = useState<boolean>(false);
  
  // Fetch filters directly from the API
  const fetchFilters = async () => {
    if (isLoading === false && filtersData !== null) return;
    
    setIsLoading(true);
    
    try {
      console.log('Fetching filters data');
      
      // Direct API call without hooks or middleware
      const response = await fetch('/api/filters');
      const data = await response.json();
      
      console.log('Filters data received:', data);
      
      // Update state with fetched data
      setFiltersData(data);
      
      // Initialize ranges
      if (data.priceRange) {
        setPriceRange({
          min: data.priceRange.min,
          max: data.priceRange.max
        });
      }
      
      if (data.caseSizeRange) {
        setCaseSizeRange({
          min: data.caseSizeRange.min,
          max: data.caseSizeRange.max
        });
      }
    } catch (error) {
      console.log('Error fetching filters:', error);
      toast.error('Failed to load filters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch filters when component mounts (only once)
  useEffect(() => {
    fetchFilters();
  }, []);
  
  // Debounced function to notify parent of filter changes
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>) => {
      if (onFilterChange) {
        console.log('Applying debounced filters:', filters);
        onFilterChange(filters);
        setPendingFilters(false);
      }
    }, 500),
    [onFilterChange]
  );
  
  // Notify parent when filters change
  useEffect(() => {
    setPendingFilters(true);
    
    const filters = {
      ...selectedOptions,
      priceRange,
      caseSizeRange
    };
    
    debouncedFilterChange(filters);
    
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [selectedOptions, priceRange, caseSizeRange, debouncedFilterChange]);
  
  // Handle selection changes for checkboxes
  const handleSelectionChange = (category: string, selected: string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected
    }));
  };
  
  // Handle price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  // Handle case size range changes
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    setCaseSizeRange({ min, max });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    // Reset to initial values from API data
    setSelectedOptions({});
    
    if (filtersData) {
      setPriceRange({
        min: filtersData.priceRange.min,
        max: filtersData.priceRange.max
      });
      
      setCaseSizeRange({
        min: filtersData.caseSizeRange.min,
        max: filtersData.caseSizeRange.max
      });
    }
    
    toast.success('Filters cleared');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-900">Filters</h2>
        <button 
          className="text-sm text-brand hover:underline"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>
      
      {isLoading ? (
        // Loading skeleton for filters
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtersData ? (
        // Actual filters when data is loaded
        <>
          <FilterCategory
            title="Price Range"
            options={[]}
            type="range"
            rangeMin={filtersData.priceRange.min}
            rangeMax={filtersData.priceRange.max}
            rangeUnit={filtersData.priceRange.unit}
            currentMin={priceRange.min}
            currentMax={priceRange.max}
            onRangeChange={handlePriceRangeChange}
          />
          
          <FilterCategory
            title="Shop by Category"
            options={filtersData.categories}
            type="checkbox"
            selectedOptions={selectedOptions.categories || []}
            onSelectionChange={(selected) => handleSelectionChange('categories', selected)}
          />
          
          <FilterCategory
            title="Brands"
            options={filtersData.brands}
            type="checkbox"
            selectedOptions={selectedOptions.brands || []}
            onSelectionChange={(selected) => handleSelectionChange('brands', selected)}
          />
          
          <FilterCategory
            title="Band"
            options={filtersData.bands}
            type="checkbox"
            selectedOptions={selectedOptions.bands || []}
            onSelectionChange={(selected) => handleSelectionChange('bands', selected)}
          />
          
          <FilterCategory
            title="Case Colour"
            options={filtersData.caseColors}
            type="checkbox"
            selectedOptions={selectedOptions.caseColors || []}
            onSelectionChange={(selected) => handleSelectionChange('caseColors', selected)}
          />
          
          <FilterCategory
            title="Colour"
            options={filtersData.colors}
            type="checkbox"
            selectedOptions={selectedOptions.colors || []}
            onSelectionChange={(selected) => handleSelectionChange('colors', selected)}
          />
          
          <FilterCategory
            title="Case Size"
            options={[]}
            type="range"
            rangeMin={filtersData.caseSizeRange.min}
            rangeMax={filtersData.caseSizeRange.max}
            rangeUnit={filtersData.caseSizeRange.unit}
            currentMin={caseSizeRange.min}
            currentMax={caseSizeRange.max}
            onRangeChange={handleCaseSizeRangeChange}
          />
        </>
      ) : null}
    </div>
  );
};

export default FilterSidebar;
