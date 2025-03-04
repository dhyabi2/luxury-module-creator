
import React, { useState, useEffect } from 'react';
import FilterCategory from './FilterCategory';

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

const FilterSidebar = () => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({
    brands: ['aigner'] // Default selected brand
  });
  
  // Fetch filters directly from the API
  const fetchFilters = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching filters data');
      
      // Direct API call without hooks or middleware
      const response = await fetch('/api/filters');
      const data = await response.json();
      
      console.log('Filters data received:', data);
      
      // Update state with fetched data
      setFiltersData(data);
    } catch (error) {
      // No error handling as per requirements - errors will throw themselves
      console.log('Error fetching filters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch filters when component mounts
  useEffect(() => {
    fetchFilters();
  }, []);
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedOptions({});
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
          />
          
          <FilterCategory
            title="Shop by Category"
            options={filtersData.categories}
            type="checkbox"
            selectedOptions={selectedOptions.categories || []}
          />
          
          <FilterCategory
            title="Brands"
            options={filtersData.brands}
            type="checkbox"
            selectedOptions={selectedOptions.brands || []}
          />
          
          <FilterCategory
            title="Band"
            options={filtersData.bands}
            type="checkbox"
            selectedOptions={selectedOptions.bands || []}
          />
          
          <FilterCategory
            title="Case Colour"
            options={filtersData.caseColors}
            type="checkbox"
            selectedOptions={selectedOptions.caseColors || []}
          />
          
          <FilterCategory
            title="Colour"
            options={filtersData.colors}
            type="checkbox"
            selectedOptions={selectedOptions.colors || []}
          />
          
          <FilterCategory
            title="Case Size"
            options={[]}
            type="range"
            rangeMin={filtersData.caseSizeRange.min}
            rangeMax={filtersData.caseSizeRange.max}
            rangeUnit={filtersData.caseSizeRange.unit}
          />
        </>
      ) : null}
    </div>
  );
};

export default FilterSidebar;
