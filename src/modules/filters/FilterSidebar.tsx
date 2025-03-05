
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FilterCategory from './FilterCategory';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface CategoryBrands {
  [key: string]: FilterOption[];
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
  categoryBrands?: CategoryBrands;
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
  initialFilters = {}
}) => {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>(initialFilters);
  
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ 
    min: initialFilters.priceRange?.min || 0, 
    max: initialFilters.priceRange?.max || 1225 
  });
  
  const [caseSizeRange, setCaseSizeRange] = useState<{min: number, max: number}>({ 
    min: initialFilters.caseSizeRange?.min || 20, 
    max: initialFilters.caseSizeRange?.max || 45 
  });
  
  const [pendingFilters, setPendingFilters] = useState<boolean>(false);
  const [showWatchFilters, setShowWatchFilters] = useState<boolean>(true);
  const [categorySpecificBrands, setCategorySpecificBrands] = useState<FilterOption[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("All Brands");
  
  // Define a mapping between category IDs and display names
  const categoryDisplayNames: {[key: string]: string} = useMemo(() => ({
    'watches': 'Watch Brands',
    'accessories': 'Accessory Brands',
    'bags': 'Bag Brands',
    'perfumes': 'Perfume Brands'
  }), []);
  
  useEffect(() => {
    const categories = selectedOptions.categories || [];
    const hasNonWatchCategories = categories.some(cat => 
      ['accessories', 'bags', 'perfumes'].includes(cat.toLowerCase())
    );
    
    console.log('[FilterSidebar] Non-watch categories selected:', hasNonWatchCategories);
    setShowWatchFilters(!hasNonWatchCategories);
    
    // Update brand filters based on selected categories
    if (filtersData) {
      if (categories.length === 0) {
        // If no category selected, show all brands
        console.log('[FilterSidebar] No categories selected, showing all brands');
        setCategorySpecificBrands(filtersData.brands);
        setActiveCategoryName("All Brands");
      } else if (categories.length === 1) {
        // If one category selected, show only brands for that category
        const category = categories[0].toLowerCase();
        console.log(`[FilterSidebar] Single category selected: ${category}, filtering brands`);
        
        if (filtersData.categoryBrands && filtersData.categoryBrands[category]) {
          setCategorySpecificBrands(filtersData.categoryBrands[category]);
          setActiveCategoryName(categoryDisplayNames[category] || `${category.charAt(0).toUpperCase()}${category.slice(1)} Brands`);
        } else {
          // Fallback to all brands if category-specific brands not found
          setCategorySpecificBrands(filtersData.brands);
          setActiveCategoryName("All Brands");
        }
      } else {
        // If multiple categories selected, show all brands
        console.log('[FilterSidebar] Multiple categories selected, showing all brands');
        setCategorySpecificBrands(filtersData.brands);
        setActiveCategoryName("All Brands");
      }
      
      // Clear brand selection if the selected brand is not in the current category-specific brands
      if (selectedOptions.brands && selectedOptions.brands.length > 0) {
        const validBrandIds = new Set(categorySpecificBrands.map(brand => brand.id));
        const newBrands = selectedOptions.brands.filter(brandId => validBrandIds.has(brandId));
        
        if (newBrands.length !== selectedOptions.brands.length) {
          console.log('[FilterSidebar] Clearing brands not in selected category');
          setSelectedOptions(prev => ({
            ...prev,
            brands: newBrands
          }));
        }
      }
    }
  }, [selectedOptions.categories, filtersData, categoryDisplayNames, categorySpecificBrands]);
  
  const fetchFilters = async () => {
    if (isLoading === false && filtersData !== null) return;
    
    setIsLoading(true);
    console.log('[FilterSidebar] Starting filters data fetch');
    
    try {
      console.log('[FilterSidebar] Sending request to /api/filters');
      
      const response = await fetch('/api/filters');
      const data = await response.json();
      
      console.log('[FilterSidebar] Filters data received:', data);
      
      // Create categoryBrands if not present in API response
      if (!data.categoryBrands) {
        console.log('[FilterSidebar] Creating category-specific brand mappings');
        data.categoryBrands = {
          'watches': data.brands.filter((brand: FilterOption) => 
            ['aigner', 'calvinKlein', 'michaelKors', 'tissot'].includes(brand.id)),
          'accessories': data.brands.filter((brand: FilterOption) => 
            ['aigner', 'michaelKors'].includes(brand.id)),
          'bags': data.brands.filter((brand: FilterOption) => 
            ['aigner', 'michaelKors'].includes(brand.id)),
          'perfumes': data.brands.filter((brand: FilterOption) => 
            ['calvinKlein'].includes(brand.id))
        };
      }
      
      setFiltersData(data);
      setCategorySpecificBrands(data.brands);
      
      if (data.priceRange) {
        console.log(`[FilterSidebar] Setting price range: ${data.priceRange.min}-${data.priceRange.max} ${data.priceRange.unit}`);
        setPriceRange({
          min: data.priceRange.min,
          max: data.priceRange.max
        });
      }
      
      if (data.caseSizeRange) {
        console.log(`[FilterSidebar] Setting case size range: ${data.caseSizeRange.min}-${data.caseSizeRange.max} ${data.caseSizeRange.unit}`);
        setCaseSizeRange({
          min: data.caseSizeRange.min,
          max: data.caseSizeRange.max
        });
      }
    } catch (error) {
      console.error('[FilterSidebar] Error fetching filters:', error);
      toast.error('Failed to load filters. Please try again.');
    } finally {
      console.log('[FilterSidebar] Filters fetch completed');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFilters();
  }, []);
  
  const debouncedFilterChange = useCallback(
    debounce((filters: Record<string, any>) => {
      if (onFilterChange) {
        console.log('[FilterSidebar] Applying debounced filters:', filters);
        onFilterChange(filters);
        setPendingFilters(false);
      }
    }, 500),
    [onFilterChange]
  );
  
  useEffect(() => {
    console.log('[FilterSidebar] Filter state changed, preparing update');
    setPendingFilters(true);
    
    const filters = {
      ...selectedOptions,
      priceRange,
      caseSizeRange
    };
    
    console.log('[FilterSidebar] Filters to be applied (debounced):', filters);
    debouncedFilterChange(filters);
    
    return () => {
      console.log('[FilterSidebar] Cleanup - cancelling debounced filter change');
      debouncedFilterChange.cancel();
    };
  }, [selectedOptions, priceRange, caseSizeRange, debouncedFilterChange]);
  
  const handleSelectionChange = (category: string, selected: string[]) => {
    console.log(`[FilterSidebar] Selection changed for ${category}:`, selected);
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected
    }));
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    console.log(`[FilterSidebar] Price range changed: ${min}-${max}`);
    setPriceRange({ min, max });
  };
  
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    console.log(`[FilterSidebar] Case size range changed: ${min}-${max}`);
    setCaseSizeRange({ min, max });
  };
  
  const handleClearFilters = () => {
    console.log('[FilterSidebar] Clearing all filters');
    setSelectedOptions({});
    
    if (filtersData) {
      console.log('[FilterSidebar] Resetting price and case size ranges to defaults');
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
            <>
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
          )}
        </>
      ) : null}
    </div>
  );
};

export default FilterSidebar;
