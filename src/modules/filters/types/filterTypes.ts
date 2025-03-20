
export interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

export interface RangeFilterProps {
  rangeMin: number;
  rangeMax: number;
  rangeUnit: string;
  currentMin: number;
  currentMax: number;
  onRangeChange: (min: number, max: number) => void;
}

export interface CheckboxFilterProps {
  options: FilterOption[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export interface FilterCategoryProps {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
  initialExpanded?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  rangeUnit?: string;
  currentMin?: number;
  currentMax?: number;
  selectedOptions?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onRangeChange?: (min: number, max: number) => void;
}
