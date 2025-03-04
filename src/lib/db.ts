
// Database connection utility
// For this implementation, we're using a simple in-memory database
// In a real application, you would connect to a proper database like PostgreSQL

// In-memory storage (simulating a database)
const db = {
  products: [],
  navigation: {},
  filters: {}
};

// Initialize the database with seed data
export const initializeDb = () => {
  console.log('Initializing in-memory database...');
  
  // Import the data from our API files
  const { products } = require('../api/products');
  const { navigationData } = require('../api/navigation');
  const { filtersData } = require('../api/filters');
  
  // Seed the database
  db.products = products;
  db.navigation = navigationData;
  db.filters = filtersData;
  
  console.log('Database initialized with seed data');
  return db;
};

// Database singleton
let dbInstance: any = null;

// Get or initialize the database
export const getDb = () => {
  if (!dbInstance) {
    dbInstance = initializeDb();
  }
  return dbInstance;
};

// Database operations for products
export const productsDb = {
  getAll: (filters: any = {}, pagination: any = {}, sorting: any = {}) => {
    console.log('DB: Getting products with filters:', filters);
    
    const db = getDb();
    let result = [...db.products];
    
    // Apply filters
    if (filters.brand) {
      result = result.filter((p: any) => 
        p.brand.toUpperCase() === filters.brand.toUpperCase()
      );
    }
    
    if (filters.category) {
      result = result.filter((p: any) => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply sorting
    if (sorting.sortBy) {
      console.log(`DB: Sorting products by ${sorting.sortBy}`);
      
      switch (sorting.sortBy) {
        case 'price-low':
          result.sort((a: any, b: any) => {
            const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
            const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
            return priceA - priceB;
          });
          break;
        case 'price-high':
          result.sort((a: any, b: any) => {
            const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
            const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
            return priceB - priceA;
          });
          break;
        case 'newest':
          // For demo purposes, randomize for "newest"
          result.sort(() => Math.random() - 0.5);
          break;
        default:
          // 'featured' - no special sorting, use default order
          break;
      }
    }
    
    // Get total count before pagination
    const totalCount = result.length;
    
    // Apply pagination
    if (pagination.page && pagination.pageSize) {
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      result = result.slice(startIndex, startIndex + pagination.pageSize);
    }
    
    return {
      products: result,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / (pagination.pageSize || 8)),
        currentPage: pagination.page || 1,
        pageSize: pagination.pageSize || 8
      }
    };
  },
  
  getById: (id: string) => {
    console.log(`DB: Getting product with id: ${id}`);
    const db = getDb();
    return db.products.find((p: any) => p.id === id);
  }
};

// Database operations for navigation
export const navigationDb = {
  getAll: () => {
    console.log('DB: Getting all navigation data');
    const db = getDb();
    return db.navigation;
  }
};

// Database operations for filters
export const filtersDb = {
  getAll: (category: string = '') => {
    console.log(`DB: Getting filters${category ? ` for category: ${category}` : ''}`);
    const db = getDb();
    
    // In a real application, you might adjust available filters based on category
    return db.filters;
  }
};

