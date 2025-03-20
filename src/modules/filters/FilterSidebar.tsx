
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterCategory from './FilterCategory';
import FilterHeader from './components/FilterHeader';
import FilterLoading from './components/FilterLoading';
import WatchSpecificFilters from './components/WatchSpecificFilters';
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
  // State management
  const [filtersData, setFiltersData] = useState<FiltersResponse | null>(null);
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
  
  // Calculate derived state
  const selectedCategories = selectedOptions.categories || [];
  const showWatchFilters = selectedCategories.includes('watches') && selectedCategories.length === 1;
  
  // Get category-specific brands
  const getCategorySpecificBrands = () => {
    if (!filtersData || !filtersData.categoryBrands || selectedCategories.length === 0) {
      return [];
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      return filtersData.categoryBrands[categoryId] || [];
    } else {
      return getCombinedBrands(filtersData.categoryBrands, selectedCategories);
    }
  };
  
  const categorySpecificBrands = getCategorySpecificBrands();
  
  // Get combined brands from multiple categories
  function getCombinedBrands(categoryBrands: any, categories: string[]): any[] {
    if (!categories || categories.length === 0) {
      return [];
    }
    
    const uniqueBrands = new Map<string, any>();
    
    categories.forEach(categoryId => {
      const brandsForCategory = categoryBrands[categoryId] || [];
      console.log(`Category ${categoryId} has ${brandsForCategory.length} brands`);
      
      brandsForCategory.forEach((brand: any) => {
        if (!uniqueBrands.has(brand.id)) {
          uniqueBrands.set(brand.id, { ...brand });
        } else {
          // If brand already exists, update the count
          const existingBrand = uniqueBrands.get(brand.id)!;
          uniqueBrands.set(brand.id, {
            ...existingBrand,
            count: (existingBrand.count || 0) + (brand.count || 0)
          });
        }
      });
    });
    
    return Array.from(uniqueBrands.values());
  }
  
  // Brand section title
  const getActiveCategoryName = () => {
    if (selectedCategories.length === 0) {
      return 'Shop by Brand';
    } else if (selectedCategories.length === 1) {
      const category = selectedCategories[0];
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Brands`;
    } else {
      return 'Brands';
    }
  };
  
  const activeCategoryName = getActiveCategoryName();
  
  // Fetch filters data
  useEffect(() => {
    const getFiltersData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching filters data from API...');
        
        // Direct API call to the edge function
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        const categoryParam = selectedCategories.length > 0 ? `?category=${selectedCategories.join(',')}` : '';
        const response = await fetch(`${SUPABASE_URL}/functions/v1/filters${categoryParam}`, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch filters:', response.status, response.statusText);
          return;
        }
        
        const data = await response.json();
        console.log('Filter data received:', Object.keys(data));
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
  }, []);
  
  // Apply filters
  const applyFilters = () => {
    setPendingFilters(true);
    
    if (onFilterChange) {
      const filters = {
        ...selectedOptions,
        priceRange,
        caseSizeRange
      };
      onFilterChange(filters);
    }
    
    setPendingFilters(false);
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
      const validBrandIds = new Set(categorySpecificBrands.map((brand: any) => brand.id));
      const invalidBrands = selectedOptions.brands.filter((brandId: string) => !validBrandIds.has(brandId));
      
      if (invalidBrands.length > 0) {
        console.log('Removing brands not in selected categories:', invalidBrands);
        const newBrands = selectedOptions.brands.filter((brandId: string) => validBrandIds.has(brandId));
        setSelectedOptions(prev => ({
          ...prev,
          brands: newBrands
        }));
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
