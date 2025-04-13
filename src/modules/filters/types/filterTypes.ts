
export interface FilterOption {
  id: string;
  name: string;
  count?: number;
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
  onSelectionChange?: (selected: string[]) => void;
  onRangeChange?: (min: number, max: number) => void;
  showAllOption?: boolean;
}

export interface RangeFilterProps {
  rangeMin: number;
  rangeMax: number;
  rangeUnit?: string;
  currentMin: number;
  currentMax: number;
  onRangeChange: (min: number, max: number) => void;
}

export interface CheckboxFilterProps {
  options: FilterOption[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  showAllOption?: boolean;
}

export interface FiltersData {
  categories: FilterOption[];
  brands: FilterOption[];
  genders: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  caseSizeRange: {
    min: number;
    max: number;
    unit: string;
  };
  categoryBrands: Record<string, FilterOption[]>;
}
