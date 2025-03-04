
// Edge API for navigation data
// No authentication, RLS, or middleware

import { navigationDb } from '../lib/db';

// Sample navigation data (used for database seeding)
export const navigationData = {
  mainCategories: [
    { id: 'women', name: 'WOMEN', active: true },
    { id: 'men', name: 'MEN', active: false }
  ],
  
  secondaryCategories: [
    { id: 'sale', name: 'Sale', highlight: true },
    { id: 'new', name: 'New in' },
    { id: 'brands', name: 'Brands' },
    { id: 'watches', name: 'Watches' },
    { id: 'jewellery', name: 'Jewellery' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'bags', name: 'Bags' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'store', name: 'Store Locator' }
  ],
  
  featuredBrands: [
    { id: 'aigner', name: 'AIGNER', featured: true },
    { id: 'cartier', name: 'Cartier', featured: true },
    { id: 'rolex', name: 'Rolex', featured: true },
    { id: 'omega', name: 'Omega', featured: false }
  ]
};

// Edge function handler
export default async (req: Request) => {
  console.log('Navigation API request received:', req.url);
  
  try {
    // Query the database
    const result = navigationDb.getAll();
    
    console.log('Returning navigation data');
    
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    // Log the error but don't handle it - let it throw itself
    console.error('Error in navigation API:', error);
    throw error;
  }
};
