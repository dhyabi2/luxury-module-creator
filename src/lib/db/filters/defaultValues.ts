
import { DefaultFilters } from "./types";

/**
 * Default filter values when we can't generate them from the database
 */
export const defaultFilters: DefaultFilters = {
  priceRange: {
    min: 0,
    max: 10000,
    unit: 'OMR'
  },
  caseSizeRange: {
    min: 20,
    max: 50,
    unit: 'mm'
  },
  categories: [
    { id: 'watches', name: 'Watches', count: 0 },
    { id: 'accessories', name: 'Accessories', count: 0 },
    { id: 'bags', name: 'Bags', count: 0 },
    { id: 'perfumes', name: 'Perfumes', count: 0 }
  ],
  brands: [
    { id: 'rolex', name: 'Rolex', count: 0 },
    { id: 'omega', name: 'Omega', count: 0 },
    { id: 'gucci', name: 'Gucci', count: 0 }
  ],
  bands: [
    { id: 'leather', name: 'Leather', count: 0 },
    { id: 'stainless_steel', name: 'Stainless Steel', count: 0 }
  ],
  caseColors: [
    { id: 'gold', name: 'Gold', count: 0 },
    { id: 'silver', name: 'Silver', count: 0 },
    { id: 'rose_gold', name: 'Rose Gold', count: 0 }
  ],
  colors: [
    { id: 'black', name: 'Black', count: 0 },
    { id: 'white', name: 'White', count: 0 },
    { id: 'blue', name: 'Blue', count: 0 }
  ],
  genders: [
    { id: 'men', name: 'Men', count: 0 },
    { id: 'women', name: 'Women', count: 0 },
    { id: 'unisex', name: 'Unisex', count: 0 }
  ],
  categoryBrands: {
    watches: [
      { id: 'rolex', name: 'Rolex', count: 0 },
      { id: 'omega', name: 'Omega', count: 0 },
      { id: 'tag_heuer', name: 'TAG Heuer', count: 0 }
    ],
    accessories: [
      { id: 'gucci', name: 'Gucci', count: 0 },
      { id: 'hermes', name: 'Hermes', count: 0 }
    ],
    bags: [
      { id: 'louis_vuitton', name: 'Louis Vuitton', count: 0 },
      { id: 'prada', name: 'Prada', count: 0 }
    ],
    perfumes: [
      { id: 'chanel', name: 'Chanel', count: 0 },
      { id: 'dior', name: 'Dior', count: 0 }
    ]
  }
};
