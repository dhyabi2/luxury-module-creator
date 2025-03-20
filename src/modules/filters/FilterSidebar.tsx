
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterCategory from './FilterCategory';
import FilterHeader from './components/FilterHeader';
import FilterLoading from './components/FilterLoading';
import WatchSpecificFilters from './components/WatchSpecificFilters';
import { fetchFiltersData, getCombinedBrands } from '@/utils/apiUtils';
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
        const data = await fetchFiltersData();
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
      } finally {
        setIsLoading(false);
      }
    };
    
    getFiltersData();
  }, []);
  
  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          ...selectedOptions,
          priceRange,
          caseSizeRange
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedOptions, priceRange, caseSizeRange, onFilterChange]);
  
  // Handle selection change
  const handleSelectionChange = (category: string, selected: string[]) => {
    if (!category) {
      console.warn('Category name is required');
      return;
    }
    
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
  
  // Validate brand selection against available brands
  useEffect(() => {
    if (filtersData && categorySpecificBrands.length > 0 && selectedOptions.brands && selectedOptions.brands.length > 0) {
      const validBrandIds = new Set(categorySpecificBrands.map(brand => brand.id));
      const invalidBrands = selectedOptions.brands.filter(brandId => !validBrandIds.has(brandId));
      
      if (invalidBrands.length > 0) {
        console.log('Removing brands not in selected categories:', invalidBrands);
        const newBrands = selectedOptions.brands.filter(brandId => validBrandIds.has(brandId));
        handleSelectionChange('brands', newBrands);
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
