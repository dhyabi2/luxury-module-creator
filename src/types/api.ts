
// API Response Types

// Product
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  brand: string;
  discount?: number;
  description?: string;
  specifications?: {
    caseMaterial?: string;
    caseSize?: string;
    dialColor?: string;
    movement?: string;
    waterResistance?: string;
    strapMaterial?: string;
    strapColor?: string;
  };
  stock?: number;
  rating?: number;
  reviews?: number;
}

// Pagination
export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Products Response
export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// Filter Option
export interface FilterOption {
  id: string;
  name: string;
  count: number;
}

// Range
export interface Range {
  min: number;
  max: number;
  unit: string;
}

// Filters Response
export interface FiltersResponse {
  priceRange: Range;
  categories: FilterOption[];
  brands: FilterOption[];
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  caseSizeRange: Range;
}

// Main Category
export interface MainCategory {
  id: string;
  name: string;
  active: boolean;
}

// Secondary Category
export interface SecondaryCategory {
  id: string;
  name: string;
  highlight?: boolean;
}

// Brand
export interface Brand {
  id: string;
  name: string;
  featured: boolean;
}

// Navigation Response
export interface NavigationResponse {
  mainCategories: MainCategory[];
  secondaryCategories: SecondaryCategory[];
  featuredBrands: Brand[];
}
