
import { DefaultFilters } from "./types";

// Default filters for fallback when database operations fail
export const defaultFilters: DefaultFilters = {
  priceRange: { min: 0, max: 1000, unit: 'OMR' },
  categories: [],
  brands: [],
  categoryBrands: {
    watches: [],
    accessories: [],
    bags: [],
    perfumes: []
  },
  bands: [],
  caseColors: [],
  colors: [],
  caseSizeRange: { min: 20, max: 45, unit: 'mm' }
};
