
import { FiltersData } from "@/lib/db/filters/types";

export type FiltersResponse = FiltersData;

export interface ProductsResponse {
  products: Product[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discount?: number;
  description?: string;
  specifications?: Record<string, any>;
  stock: number;
  rating: number;
  reviews: number;
  currency: string;
  image: string;
}

export interface CategoryResponse {
  categories: {
    id: string;
    name: string;
    count: number;
    image: string;
    description?: string;
  }[];
}
