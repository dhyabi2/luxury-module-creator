
// Database utility - main export file
// Re-exporting all database modules for backward compatibility

import { initializeDb, getDb } from './db/connection';
import { productsDb } from './db/products';
import { navigationDb } from './db/navigation';
import { filtersDb } from './db/filters';

// Export all the modules
export {
  initializeDb,
  getDb,
  productsDb,
  navigationDb,
  filtersDb
};
