
import { useState, useEffect, useMemo } from 'react';
import { FilterOption } from '@/types/api';
import { FiltersData } from '@/lib/db/filters/types';

interface UseCategoryBrandsProps {
  selectedCategories: string[];
  filtersData: FiltersData | null;
}

export const useCategoryBrands = ({ 
  selectedCategories, 
  filtersData 
}: UseCategoryBrandsProps) => {
  const [showWatchFilters, setShowWatchFilters] = useState<boolean>(true);
  const [categorySpecificBrands, setCategorySpecificBrands] = useState<FilterOption[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("All Brands");
  
  const categoryDisplayNames: {[key: string]: string} = useMemo(() => ({
    'watches': 'Watch Brands',
    'accessories': 'Accessory Brands',
    'bags': 'Bag Brands',
    'perfumes': 'Perfume Brands'
  }), []);
  
  useEffect(() => {
    const categories = selectedCategories || [];
    const hasNonWatchCategories = categories.some(cat => 
      ['accessories', 'bags', 'perfumes'].includes(cat.toLowerCase())
    );
    
    console.log('[useCategoryBrands] Non-watch categories selected:', hasNonWatchCategories);
    setShowWatchFilters(!hasNonWatchCategories);
    
    if (filtersData?.categoryBrands) {
      if (categories.length === 0) {
        console.log('[useCategoryBrands] No categories selected, showing all brands');
        setCategorySpecificBrands(filtersData.brands);
        setActiveCategoryName("All Brands");
      } else if (categories.length === 1) {
        const category = categories[0].toLowerCase();
        console.log(`[useCategoryBrands] Single category selected: ${category}, filtering brands`);
        
        if (filtersData.categoryBrands && filtersData.categoryBrands[category]) {
          setCategorySpecificBrands(filtersData.categoryBrands[category]);
          setActiveCategoryName(categoryDisplayNames[category] || `${category.charAt(0).toUpperCase()}${category.slice(1)} Brands`);
        } else {
          setCategorySpecificBrands(filtersData.brands);
          setActiveCategoryName("All Brands");
        }
      } else {
        console.log('[useCategoryBrands] Multiple categories selected, showing combined brands');
        
        const combinedBrands: FilterOption[] = [];
        const seenBrandIds = new Set<string>();
        
        categories.forEach(category => {
          const categoryLower = category.toLowerCase();
          if (filtersData.categoryBrands && filtersData.categoryBrands[categoryLower]) {
            const categoryBrands = filtersData.categoryBrands[categoryLower];
            
            categoryBrands.forEach(brand => {
              if (!seenBrandIds.has(brand.id)) {
                combinedBrands.push(brand);
                seenBrandIds.add(brand.id);
              }
            });
          }
        });
        
        console.log(`[useCategoryBrands] Combined ${combinedBrands.length} brands from ${categories.length} categories`);
        
        if (combinedBrands.length > 0) {
          setCategorySpecificBrands(combinedBrands);
          setActiveCategoryName("Mixed Category Brands");
        } else {
          setCategorySpecificBrands(filtersData.brands);
          setActiveCategoryName("All Brands");
        }
      }
    }
  }, [selectedCategories, filtersData, categoryDisplayNames]);
  
  return {
    showWatchFilters,
    categorySpecificBrands,
    activeCategoryName
  };
};
