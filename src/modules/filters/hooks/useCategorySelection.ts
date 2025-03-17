
import { useState, useCallback } from 'react';

interface CategorySelections {
  [key: string]: string[];
}

interface UseCategorySelectionProps {
  initialSelections: CategorySelections;
  onUpdate?: () => void;
}

/**
 * Hook for managing category selection state and changes
 * 
 * @param initialSelections - Initial category selections
 * @param onUpdate - Optional callback when selections change
 */
export const useCategorySelection = ({ 
  initialSelections,
  onUpdate
}: UseCategorySelectionProps) => {
  const [selectedOptions, setSelectedOptions] = useState<CategorySelections>(initialSelections || {});

  // Handler for selection changes
  const handleSelectionChange = useCallback((category: string, selected: string[]) => {
    if (!category) {
      console.warn('[useCategorySelection] Category name is required');
      return;
    }
    
    console.log(`[useCategorySelection] Selection changed for ${category}:`, selected);
    
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected || []
    }));
    
    if (onUpdate) {
      try {
        onUpdate();
      } catch (error) {
        console.error('[useCategorySelection] Error in onUpdate callback:', error);
      }
    }
  }, [onUpdate]);

  // Reset selections to initial state
  const resetSelections = useCallback((newSelections?: CategorySelections) => {
    console.log('[useCategorySelection] Resetting selections', newSelections || initialSelections);
    setSelectedOptions(newSelections || initialSelections || {});
  }, [initialSelections]);

  return {
    selectedOptions,
    setSelectedOptions,
    handleSelectionChange,
    resetSelections
  };
};
