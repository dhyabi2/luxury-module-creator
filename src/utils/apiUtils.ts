
import { ProductsResponse, Product, FiltersResponse } from '@/types/api';

interface ProductQueryParams {
  gender?: string;
  brand?: string;
  category?: string;
  isNewIn?: boolean;
  isOnSale?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  minCaseSize?: number;
  maxCaseSize?: number;
  band?: string;
  caseColor?: string;
  color?: string;
}

// Simple mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Timepiece",
    price: 299.99,
    currency: "$",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    category: "watches",
    brand: "Timex",
    discount: 10,
    description: "A classic timepiece that never goes out of style.",
    specifications: {
      caseMaterial: "Stainless Steel",
      caseSize: "42mm",
      dialColor: "Black",
      movement: "Automatic",
      waterResistance: "30m",
      strapMaterial: "Leather",
      strapColor: "Brown"
    },
    stock: 15,
    rating: 4.5,
    reviews: 120
  },
  {
    id: "2",
    name: "Luxury Gold Watch",
    price: 999.99,
    currency: "$",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
    category: "watches",
    brand: "Rolex",
    specifications: {
      caseMaterial: "Gold",
      caseSize: "40mm",
      dialColor: "Gold",
      movement: "Automatic",
      waterResistance: "100m",
      strapMaterial: "Gold",
      strapColor: "Gold"
    },
    stock: 5,
    rating: 5,
    reviews: 42
  }
];

// Mock filters data
const mockFilters: FiltersResponse = {
  priceRange: {
    min: 0,
    max: 1225,
    unit: "$"
  },
  categories: [
    { id: "watches", name: "Watches", count: 45 },
    { id: "accessories", name: "Accessories", count: 12 }
  ],
  brands: [
    { id: "timex", name: "Timex", count: 8 },
    { id: "rolex", name: "Rolex", count: 15 },
    { id: "seiko", name: "Seiko", count: 12 }
  ],
  categoryBrands: {
    "watches": [
      { id: "timex", name: "Timex", count: 8 },
      { id: "rolex", name: "Rolex", count: 15 },
      { id: "seiko", name: "Seiko", count: 12 }
    ],
    "accessories": [
      { id: "gucci", name: "Gucci", count: 5 },
      { id: "prada", name: "Prada", count: 7 }
    ]
  },
  bands: [
    { id: "leather", name: "Leather", count: 25 },
    { id: "metal", name: "Metal", count: 20 }
  ],
  caseColors: [
    { id: "gold", name: "Gold", count: 15 },
    { id: "silver", name: "Silver", count: 30 }
  ],
  colors: [
    { id: "black", name: "Black", count: 18 },
    { id: "brown", name: "Brown", count: 12 }
  ],
  genders: [
    { id: "men", name: "Men", count: 30 },
    { id: "women", name: "Women", count: 25 },
    { id: "unisex", name: "Unisex", count: 10 }
  ],
  caseSizeRange: {
    min: 20,
    max: 45,
    unit: "mm"
  }
};

// Mock navigation data
const mockNavigation = {
  mainCategories: [
    { id: "watches", name: "Watches", active: true },
    { id: "accessories", name: "Accessories", active: false }
  ],
  secondaryCategories: [
    { id: "newin", name: "New In", highlight: true },
    { id: "sale", name: "Sale", highlight: true }
  ],
  featuredBrands: [
    { id: "rolex", name: "Rolex", featured: true },
    { id: "omega", name: "Omega", featured: true }
  ]
};

// Simulate loading delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch products with filters
export const fetchProducts = async (params: ProductQueryParams): Promise<ProductsResponse> => {
  console.log("Fetching products with params:", params);

  // In a real app, we would use actual API endpoints
  try {
    // Simulate API call latency
    await delay(300);
    
    // Filter and paginate mock products based on params
    let filteredProducts = [...mockProducts];
    
    // Simple filtering for demo
    if (params.brand) {
      const brands = params.brand.split(',');
      filteredProducts = filteredProducts.filter(p => brands.includes(p.brand.toLowerCase()));
    }
    
    if (params.category) {
      const categories = params.category.split(',');
      filteredProducts = filteredProducts.filter(p => categories.includes(p.category.toLowerCase()));
    }
    
    // Calculate pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 8;
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
    
    return {
      products: paginatedProducts,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize
      }
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch product by ID
export const fetchProductById = async (productId: string): Promise<Product> => {
  console.log("Fetching product with ID:", productId);
  
  try {
    // Simulate API call latency
    await delay(200);
    
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Fetch filters
export const fetchFilters = async (): Promise<FiltersResponse> => {
  console.log("Fetching filters");
  
  try {
    // Simulate API call latency
    await delay(200);
    
    return mockFilters;
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};

// Fetch navigation
export const fetchNavigation = async () => {
  console.log("Fetching navigation");
  
  try {
    // Simulate API call latency
    await delay(150);
    
    return mockNavigation;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    throw error;
  }
};

// For backward compatibility with existing code
export const fetchFiltersData = fetchFilters;
export const fetchNavigationData = fetchNavigation;
export const fetchProductDetail = fetchProductById;

// Utility function to combine brands from multiple categories
export const getCombinedBrands = (
  categoryBrands: Record<string, any[]>,
  selectedCategories: string[]
): any[] => {
  // Create a map to store unique brands by ID
  const uniqueBrands = new Map<string, any>();
  
  // Iterate through selected categories
  selectedCategories.forEach(categoryId => {
    // Get brands for this category
    const brandsForCategory = categoryBrands[categoryId] || [];
    
    // Add each brand to our map (this automatically deduplicates by ID)
    brandsForCategory.forEach(brand => {
      uniqueBrands.set(brand.id, brand);
    });
  });
  
  // Convert map back to array and return
  return Array.from(uniqueBrands.values());
};
