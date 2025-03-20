
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
    gender?: string;
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

// Product filter options
export interface FilterOption {
  id: string;
  name: string;
  count: number;
}

// Category-specific brand mapping
export interface CategoryBrands {
  [categoryId: string]: FilterOption[];
}

// Complete filters response
export interface FiltersResponse {
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
