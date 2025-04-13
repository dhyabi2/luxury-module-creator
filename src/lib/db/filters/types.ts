
export interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

export interface RangeFilter {
  min: number;
  max: number;
  unit: string;
}

export interface FiltersData {
  priceRange: RangeFilter;
  caseSizeRange: RangeFilter;
  categories: FilterOption[];
  brands: FilterOption[];
  genders: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  categoryBrands: Record<string, FilterOption[]>;
}

export interface ProductType {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  specifications: Record<string, any>;
  [key: string]: any;
}
