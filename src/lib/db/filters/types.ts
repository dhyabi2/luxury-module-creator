
import { FilterOption, FiltersResponse, CategoryBrands } from "@/types/api";

// Define interfaces for filter-related type safety
export interface SpecificationsType {
  strapMaterial?: string;
  caseMaterial?: string;
  dialColor?: string;
  strapColor?: string;
  caseSize?: string;
  gender?: string;
  [key: string]: string | undefined;
}

export interface ProductType {
  category: string;
  brand: string;
  price: number;
  gender?: string;
  specifications?: SpecificationsType;
}

export interface FiltersData {
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  categories: FilterOption[];
  brands: FilterOption[];
  categoryBrands: CategoryBrands;
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  genders: FilterOption[];
  caseSizeRange: {
    min: number;
    max: number;
    unit: string;
  };
}

// Type for default filter values
export interface DefaultFilters {
  priceRange: { min: number; max: number; unit: string };
  categories: FilterOption[];
  brands: FilterOption[];
  categoryBrands: CategoryBrands;
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  genders: FilterOption[];
  caseSizeRange: { min: number; max: number; unit: string };
}
