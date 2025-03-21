
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterHeader from './components/FilterHeader';
import FilterSidebarContent from './components/FilterSidebarContent';

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
  // Static filters data
  const [filtersData, setFiltersData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState(initialFilters);
  
  // Price range state
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.priceRange?.min || 0,
    max: initialFilters.priceRange?.max || 1225
  });
  
  // Case size range state
  const [caseSizeRange, setCaseSizeRange] = useState({
    min: initialFilters.caseSizeRange?.min || 20,
    max: initialFilters.caseSizeRange?.max || 45
  });
  
  // Load static filters data
  useEffect(() => {
    setIsLoading(true);
    
    // Static filters data
    const staticFiltersData = {
      categories: [
        { id: 'watches', name: 'Watches', count: 85 },
        { id: 'accessories', name: 'Accessories', count: 24 },
        { id: 'bags', name: 'Bags', count: 18 },
        { id: 'perfumes', name: 'Perfumes', count: 32 }
      ],
      brands: [
        { id: 'aigner', name: 'AIGNER', count: 85 },
        { id: 'cartier', name: 'Cartier', count: 32 },
        { id: 'rolex', name: 'Rolex', count: 28 },
        { id: 'gucci', name: 'Gucci', count: 45 },
        { id: 'chopard', name: 'Chopard', count: 19 },
        { id: 'omega', name: 'Omega', count: 37 },
        { id: 'louis-vuitton', name: 'Louis Vuitton', count: 23 }
      ],
      genders: [
        { id: 'men', name: 'Men', count: 60 },
        { id: 'women', name: 'Women', count: 75 },
        { id: 'unisex', name: 'Unisex', count: 25 }
      ],
      bands: [
        { id: 'bracelet', name: 'Bracelet', count: 48 },
        { id: 'leather', name: 'Leather', count: 36 },
        { id: 'leather-strap', name: 'Leather Strap', count: 27 }
      ],
      caseColors: [
        { id: 'gold', name: 'Gold', count: 29 },
        { id: 'silver', name: 'Silver', count: 34 },
        { id: 'rose-gold', name: 'Rose Gold', count: 23 }
      ],
      colors: [
        { id: 'black', name: 'Black', count: 45 },
        { id: 'blue', name: 'Blue', count: 18 },
        { id: 'red', name: 'Red', count: 16 }
      ],
      priceRange: {
        min: 16,
        max: 1225,
        unit: 'OMR'
      },
      caseSizeRange: {
        min: 20,
        max: 45,
        unit: 'mm'
      },
      categoryBrands: {
        watches: [
          { id: 'rolex', name: 'Rolex', count: 28 },
          { id: 'omega', name: 'Omega', count: 37 },
          { id: 'cartier', name: 'Cartier', count: 32 }
        ],
        accessories: [
          { id: 'gucci', name: 'Gucci', count: 18 },
          { id: 'louis-vuitton', name: 'Louis Vuitton', count: 20 }
        ],
        bags: [
          { id: 'louis-vuitton', name: 'Louis Vuitton', count: 15 },
          { id: 'gucci', name: 'Gucci', count: 14 }
        ],
        perfumes: [
          { id: 'gucci', name: 'Gucci', count: 13 },
          { id: 'chopard', name: 'Chopard', count: 19 }
        ]
      }
    };
    
    // Initialize with static data
    setFiltersData(staticFiltersData);
    setIsLoading(false);
    
    // Set initial price range if available
    if (staticFiltersData.priceRange) {
      setPriceRange({
        min: initialFilters.priceRange?.min || staticFiltersData.priceRange.min,
        max: initialFilters.priceRange?.max || staticFiltersData.priceRange.max
      });
    }
    
    // Set initial case size range if available
    if (staticFiltersData.caseSizeRange) {
      setCaseSizeRange({
        min: initialFilters.caseSizeRange?.min || staticFiltersData.caseSizeRange.min,
        max: initialFilters.caseSizeRange?.max || staticFiltersData.caseSizeRange.max
      });
    }
    
    // Add category from URL param if provided
    if (categoryParam && 
        selectedOptions.categories && 
        !selectedOptions.categories.includes(categoryParam)) {
      setSelectedOptions(prev => ({
        ...prev,
        categories: [...(prev.categories || []), categoryParam]
      }));
    }
  }, [initialFilters, categoryParam]);
  
  // Calculate category-specific brands
  const getCategorySpecificBrands = () => {
    if (!filtersData || !filtersData.categoryBrands) {
      return filtersData?.brands || [];
    }
    
    const selectedCategories = selectedOptions.categories || [];
    
    if (selectedCategories.length === 0) {
      return filtersData.brands || [];
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      const result = filtersData.categoryBrands[categoryId] || [];
      console.log(`Getting brands for single category ${categoryId}:`, result.length);
      return result;
    } else {
      // Combine brands from multiple categories with unique brands only
      const uniqueBrands = new Map();
      
      selectedCategories.forEach(categoryId => {
        const brandsForCategory = filtersData.categoryBrands[categoryId] || [];
        
        brandsForCategory.forEach(brand => {
          uniqueBrands.set(brand.id, brand);
        });
      });
      
      const result = Array.from(uniqueBrands.values());
      console.log(`Getting combined brands for ${selectedCategories.length} categories:`, result.length);
      return result;
    }
  };
  
  // Get active category name for display
  const getActiveCategoryName = () => {
    const selectedCategories = selectedOptions.categories || [];
    
    if (selectedCategories.length === 0) {
      return "Shop by Brand";
    }
    
    if (selectedCategories.length === 1) {
      const categoryId = selectedCategories[0];
      const category = filtersData?.categories.find(c => c.id === categoryId);
      return category ? `${category.name} Brands` : "Shop by Brand";
    }
    
    return "Shop by Brand";
  };
  
  const categorySpecificBrands = getCategorySpecificBrands();
  const activeCategoryName = getActiveCategoryName();
  
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
    
    // Apply filters
    if (onFilterChange) {
      onFilterChange({
        ...selectedOptions,
        [category]: selected || [],
        priceRange,
        caseSizeRange
      });
    }
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    
    // Apply filters
    if (onFilterChange) {
      onFilterChange({
        ...selectedOptions,
        priceRange: { min, max },
        caseSizeRange
      });
    }
  };
  
  // Handle case size range change
  const handleCaseSizeRangeChange = (min: number, max: number) => {
    setCaseSizeRange({ min, max });
    
    // Apply filters
    if (onFilterChange) {
      onFilterChange({
        ...selectedOptions,
        priceRange,
        caseSizeRange: { min, max }
      });
    }
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
    
    // Apply cleared filters
    if (onFilterChange) {
      onFilterChange({
        priceRange: {
          min: filtersData?.priceRange?.min || 0,
          max: filtersData?.priceRange?.max || 1225
        },
        caseSizeRange: {
          min: filtersData?.caseSizeRange?.min || 20,
          max: filtersData?.caseSizeRange?.max || 45
        }
      });
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
