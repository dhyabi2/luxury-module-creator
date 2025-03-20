
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterHeader from './components/FilterHeader';
import FilterSidebarContent from './components/FilterSidebarContent';
import { fetchFiltersData } from './apis/filtersApi';
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
  const activeCategoryName = getActiveCategoryName(selectedCategories);
  
  // Fetch filters data
  useEffect(() => {
    const getFiltersData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFiltersData(selectedCategories.length > 0 ? selectedCategories : undefined);
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
    if (onFilterChange) {
      const filters = {
        ...selectedOptions,
        priceRange,
        caseSizeRange
      };
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
