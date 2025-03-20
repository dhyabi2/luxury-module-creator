
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import FilterCategory from './FilterCategory';
import FilterHeader from './components/FilterHeader';
import FilterLoading from './components/FilterLoading';
import WatchSpecificFilters from './components/WatchSpecificFilters';
import { fetchFilters, getCombinedBrands } from '@/utils/apiUtils';
import { FiltersData } from '@/lib/db/filters/types';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  // State management
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
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
  const [pendingFilters, setPendingFilters] = useState(false);
  
  // Track if we're batching updates to avoid multiple filter applications
  const isUpdating = useRef(false);
  const filterChangeTimeout = useRef<number | null>(null);
  
  // Calculate derived state
  const selectedCategories = selectedOptions.categories || [];
  const showWatchFilters = selectedCategories.includes('watches') && selectedCategories.length === 1;
  
  // Get category-specific brands
  const categorySpecificBrands = React.useMemo(() => {
    if (!filtersData || !filtersData.categoryBrands || selectedCategories.length === 0) {
      return [];
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      return filtersData.categoryBrands[categoryId] || [];
    } else {
      return getCombinedBrands(filtersData.categoryBrands, selectedCategories);
    }
  }, [filtersData, selectedCategories]);
  
  // Brand section title
  const activeCategoryName = React.useMemo(() => {
    if (selectedCategories.length === 0) {
      return 'Shop by Brand';
    } else if (selectedCategories.length === 1) {
      const category = selectedCategories[0];
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Brands`;
    } else {
      return 'Brands';
    }
  }, [selectedCategories]);
  
  // Fetch filters data
  useEffect(() => {
    const getFiltersData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFilters();
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
      } catch (error) {
        console.error('Error fetching filters:', error);
        toast.error('Failed to load filters', {
          description: 'Please try again later.',
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getFiltersData();
  }, []);
  
  // Helper function to start a batch update
  const startBatchUpdate = () => {
    isUpdating.current = true;
  };
  
  // Helper function to end a batch update
  const endBatchUpdate = (callback?: () => void) => {
    setTimeout(() => {
      isUpdating.current = false;
      if (callback) {
        callback();
      }
    }, 0);
  };
  
  // Apply filters with debounce
  const applyFilters = () => {
    if (isUpdating.current) {
      console.log('Skipping filter update while batch updating');
      return;
    }
    
    setPendingFilters(true);
    
    // Clear any existing timeout
    if (filterChangeTimeout.current !== null) {
      window.clearTimeout(filterChangeTimeout.current);
    }
    
    // Set a new timeout for the filter change
    filterChangeTimeout.current = window.setTimeout(() => {
      if (onFilterChange) {
        const filters = {
          ...selectedOptions,
          priceRange,
          caseSizeRange
        };
        onFilterChange(filters);
      }
      setPendingFilters(false);
      filterChangeTimeout.current = null;
    }, 500);
  };
  
  // Apply filters when state changes
  useEffect(() => {
    if (!isUpdating.current) {
      applyFilters();
    }
    
    return () => {
      if (filterChangeTimeout.current !== null) {
        window.clearTimeout(filterChangeTimeout.current);
      }
    };
  }, [selectedOptions, priceRange, caseSizeRange, onFilterChange]);
  
  // Handle selection change
  const handleSelectionChange = (category: string, selected: string[]) => {
    if (!category) {
      console.warn('Category name is required');
      return;
    }
    
    startBatchUpdate();
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected || []
    }));
    endBatchUpdate(applyFilters);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    startBatchUpdate();
    setPriceRange({ min, max });
    endBatchUpdate(applyFilters);
  };
  
  // Handle case size range change
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    startBatchUpdate();
    setCaseSizeRange({ min, max });
    endBatchUpdate(applyFilters);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    startBatchUpdate();
    
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
    
    endBatchUpdate(applyFilters);
    
    toast.success('Filters cleared');
  };
  
  // Validate brand selection against available brands
  useEffect(() => {
    if (filtersData && categorySpecificBrands.length > 0 && selectedOptions.brands && selectedOptions.brands.length > 0) {
      const validBrandIds = new Set(categorySpecificBrands.map(brand => brand.id));
      const invalidBrands = selectedOptions.brands.filter(brandId => !validBrandIds.has(brandId));
      
      if (invalidBrands.length > 0) {
        console.log('Removing brands not in selected categories:', invalidBrands);
        startBatchUpdate();
        const newBrands = selectedOptions.brands.filter(brandId => validBrandIds.has(brandId));
        setSelectedOptions(prev => ({
          ...prev,
          brands: newBrands
        }));
        endBatchUpdate(applyFilters);
      }
    }
  }, [categorySpecificBrands, selectedOptions.brands, filtersData]);

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <FilterHeader onClearFilters={handleClearFilters} />
      
      {isLoading ? (
        <FilterLoading />
      ) : filtersData ? (
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
            title={activeCategoryName}
            options={categorySpecificBrands}
            type="checkbox"
            selectedOptions={selectedOptions.brands || []}
            onSelectionChange={(selected) => handleSelectionChange('brands', selected)}
          />
          
          {showWatchFilters && (
            <WatchSpecificFilters
              filtersData={filtersData}
              selectedOptions={selectedOptions}
              caseSizeRange={caseSizeRange}
              onSelectionChange={handleSelectionChange}
              onCaseSizeRangeChange={handleCaseSizeRangeChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default FilterSidebar;
