
import { Json } from "@/integrations/supabase/types";

export interface RangeValue {
  min: number;
  max: number;
  unit: string;
}

export interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

export interface FiltersData {
  priceRange: RangeValue;
  caseSizeRange: RangeValue;
  categories: FilterOption[];
  brands: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  genders: FilterOption[];
  categoryBrands: Record<string, FilterOption[]>;
}

export interface ProductType {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  specifications: Record<string, any>;
  image: string;
  currency: string;
  description?: string;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
}

export interface DefaultFilters {
  priceRange: RangeValue;
  caseSizeRange: RangeValue;
  categories: FilterOption[];
  brands: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  genders: FilterOption[];
  categoryBrands: Record<string, FilterOption[]>;
}
