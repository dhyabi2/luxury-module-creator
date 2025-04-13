
import { FiltersData } from "./types";

// Default filters data - used as fallback
export const defaultFilters: FiltersData = {
  priceRange: {
    min: 16,
    max: 1225,
    unit: 'OMR'
  },
  caseSizeRange: {
    min: 20,
    max: 45,
    unit: 'mm'
  },
  categories: [
    { id: 'watches', name: 'Watches', count: 85 },
    { id: 'accessories', name: 'Accessories', count: 24 },
    { id: 'bags', name: 'Bags', count: 18 },
    { id: 'perfumes', name: 'Perfumes', count: 32 }
  ],
  brands: [
    { id: 'aigner', name: 'AIGNER', count: 85 },
    { id: 'cartier', name: 'Cartier', count: 32 },
    { id: 'rolex', name: 'Rolex', count: 28 },
    { id: 'gucci', name: 'Gucci', count: 45 },
    { id: 'chopard', name: 'Chopard', count: 19 },
  ],
  genders: [
    { id: 'men', name: 'Men', count: 60 },
    { id: 'women', name: 'Women', count: 75 },
    { id: 'unisex', name: 'Unisex', count: 25 }
  ],
  bands: [
    { id: 'bracelet', name: 'Bracelet', count: 48 },
    { id: 'leather', name: 'Leather', count: 36 },
    { id: 'leather-strap', name: 'Leather Strap', count: 27 }
  ],
  caseColors: [
    { id: 'gold', name: 'Gold', count: 29 },
    { id: 'silver', name: 'Silver', count: 34 },
    { id: 'rose-gold', name: 'Rose Gold', count: 23 }
  ],
  colors: [
    { id: 'black', name: 'Black', count: 45 },
    { id: 'blue', name: 'Blue', count: 18 },
    { id: 'red', name: 'Red', count: 16 }
  ],
  categoryBrands: {
    watches: [
      { id: 'rolex', name: 'Rolex', count: 28 },
      { id: 'omega', name: 'Omega', count: 37 },
      { id: 'cartier', name: 'Cartier', count: 32 }
    ],
    accessories: [
      { id: 'gucci', name: 'Gucci', count: 18 },
      { id: 'louis-vuitton', name: 'Louis Vuitton', count: 20 }
    ],
    bags: [
      { id: 'louis-vuitton', name: 'Louis Vuitton', count: 15 },
      { id: 'gucci', name: 'Gucci', count: 14 }
    ],
    perfumes: [
      { id: 'gucci', name: 'Gucci', count: 13 },
      { id: 'chopard', name: 'Chopard', count: 19 }
    ]
  }
};
