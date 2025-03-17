
import { useState, useCallback } from 'react';

interface UseCategorySelectionProps {
  initialSelections: { [key: string]: string[] };
  onUpdate?: () => void;
}

export const useCategorySelection = ({ 
  initialSelections,
  onUpdate
}: UseCategorySelectionProps) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>(initialSelections);

  // Handler for selection changes
  const handleSelectionChange = useCallback((category: string, selected: string[]) => {
    console.log(`[useCategorySelection] Selection changed for ${category}:`, selected);
    
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selected
    }));
    
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  return {
    selectedOptions,
    setSelectedOptions,
    handleSelectionChange
  };
};
