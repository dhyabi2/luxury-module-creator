
// Edge API for filters data
// No authentication, RLS, or middleware

// Sample filter data
export const filtersData = {
  priceRange: { min: 16, max: 1225, unit: 'OMR' },
  
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
    { id: 'omega', name: 'Omega', count: 37 },
    { id: 'louis-vuitton', name: 'Louis Vuitton', count: 23 }
  ],
  
  bands: [
    { id: 'bracelet', name: 'Bracelet', count: 48 },
    { id: 'leather', name: 'Leather', count: 36 },
    { id: 'leather-strap', name: 'Leather Strap', count: 27 }
  ],
  
  caseColors: [
    { id: 'gold', name: 'Gold', count: 29 },
    { id: 'gold-silver', name: 'Gold/Silver', count: 17 },
    { id: 'rose-gold', name: 'Rose Gold', count: 23 },
    { id: 'rose-gold-silver', name: 'Rose Gold/Silver', count: 12 },
    { id: 'silver', name: 'Silver', count: 34 },
    { id: 'silver-gold', name: 'Silver/Gold', count: 14 }
  ],
  
  colors: [
    { id: 'baby-beige', name: 'Baby Beige', count: 8 },
    { id: 'baby-pink', name: 'Baby Pink', count: 7 },
    { id: 'antique-white', name: 'Antique White', count: 5 },
    { id: 'bellflower-blue', name: 'Bellflower Blue', count: 9 },
    { id: 'bison-brown', name: 'Bison Brown', count: 12 },
    { id: 'black', name: 'Black', count: 45 },
    { id: 'black-colored', name: 'BLACK COLOURED', count: 13 },
    { id: 'blue', name: 'Blue', count: 18 },
    { id: 'burgundy', name: 'Burgundy', count: 6 },
    { id: 'green', name: 'Green', count: 14 },
    { id: 'navy', name: 'Navy', count: 11 },
    { id: 'red', name: 'Red', count: 16 }
  ],
  
  caseSizeRange: { min: 20, max: 45, unit: 'mm' }
};

// Edge function handler
export default async (req: Request) => {
  console.log('Filters API request received:', req.url);
  
  // Parse URL and query parameters
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || '';
  
  // Return specific filters based on category or return all filters
  let responseData = { ...filtersData };
  
  if (category) {
    console.log(`Filtering options for category: ${category}`);
    // In a real API, we might adjust filters based on category
    // Here we'll just return the full set for simplicity
  }
  
  console.log('Returning filters data');
  
  // Return the response
  return new Response(
    JSON.stringify(responseData),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
