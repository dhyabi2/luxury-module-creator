
// Main export file for products database operations
import { getAll } from './getAll';
import { getById } from './getById';

// Export as a single object for backward compatibility
export const productsDb = {
  getAll,
  getById
};
