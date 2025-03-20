
// Main export file for products database operations
import { getAll } from './getAll';
import { getById } from './getById';
import { applyFilters } from './filters';

// Export individual functions directly
export { getAll, getById, applyFilters };

// Export as a single object for backward compatibility
export const productsDb = {
  getAll,
  getById
};
