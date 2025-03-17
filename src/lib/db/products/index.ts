
// Main export file for products database operations
import { getAll } from './getAll';
import { getById } from './getById';
import { applyFilters } from './filters';

// Export as a single object for backward compatibility
export const productsDb = {
  getAll,
  getById
};

// Export filters module for direct access if needed
export { applyFilters };
