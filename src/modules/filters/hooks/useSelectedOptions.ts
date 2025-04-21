
import { useState } from 'react';

export function useSelectedOptions(initialOptions: Record<string, string[]> = {}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(initialOptions);
  
  return {
    selectedOptions,
    setSelectedOptions
  };
}
