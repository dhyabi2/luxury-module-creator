
// Edge API for products data
// No authentication, RLS, or middleware

// Sample product data
export const products = [
  {
    id: '1',
    name: 'AIGNER ALBA WOMEN\'S WATCH 36MM',
    price: 299.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+1',
    category: 'watches',
    brand: 'AIGNER',
    discount: 20,
    description: 'Elegant women\'s watch with premium craftsmanship and attention to detail.',
    specifications: {
      caseMaterial: 'Stainless Steel',
      caseSize: '36mm',
      dialColor: 'Mother of Pearl',
      movement: 'Swiss Quartz',
      waterResistance: '30m',
      strapMaterial: 'Leather',
      strapColor: 'Brown',
    },
    stock: 15,
    rating: 4.7,
    reviews: 24
  },
  {
    id: '2',
    name: 'AIGNER ALESSANDRA LADIES WATCH 30MM',
    price: 272.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+2',
    category: 'watches',
    brand: 'AIGNER',
    description: 'Sophisticated ladies timepiece with minimalist design and premium materials.',
    specifications: {
      caseMaterial: 'Rose Gold Plated',
      caseSize: '30mm',
      dialColor: 'Silver',
      movement: 'Swiss Quartz',
      waterResistance: '30m',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Rose Gold',
    },
    stock: 8,
    rating: 4.5,
    reviews: 18
  },
  {
    id: '3',
    name: 'AIGNER RAVENNA LADIES WATCH 33MM GOLD',
    price: 310.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+3',
    category: 'watches',
    brand: 'AIGNER',
    discount: 15,
    description: 'Luxurious gold-plated watch with diamond markers and scratch-resistant sapphire crystal.',
    specifications: {
      caseMaterial: 'Gold Plated',
      caseSize: '33mm',
      dialColor: 'Champagne',
      movement: 'Swiss Quartz',
      waterResistance: '50m',
      strapMaterial: 'Gold Plated',
      strapColor: 'Gold',
    },
    stock: 5,
    rating: 4.9,
    reviews: 32
  },
  {
    id: '4',
    name: 'AIGNER PORTOFINO LADIES WATCH 32MM SILVER',
    price: 259.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+4',
    category: 'watches',
    brand: 'AIGNER',
    description: 'Elegant silver timepiece with precision engineering and timeless design.',
    specifications: {
      caseMaterial: 'Stainless Steel',
      caseSize: '32mm',
      dialColor: 'White',
      movement: 'Swiss Quartz',
      waterResistance: '30m',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
    },
    stock: 12,
    rating: 4.3,
    reviews: 15
  },
  {
    id: '5',
    name: 'AIGNER SIENA DIAMOND LADIES WATCH 28MM',
    price: 350.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+5',
    category: 'watches',
    brand: 'AIGNER',
    discount: 10,
    description: 'Premium ladies watch featuring real diamond indices and mother of pearl dial.',
    specifications: {
      caseMaterial: 'Rose Gold Plated',
      caseSize: '28mm',
      dialColor: 'Mother of Pearl',
      movement: 'Swiss Quartz',
      waterResistance: '30m',
      strapMaterial: 'Leather',
      strapColor: 'Pink',
    },
    stock: 3,
    rating: 5.0,
    reviews: 27
  },
  {
    id: '6',
    name: 'AIGNER GARDA LADIES WATCH 32MM ROSE GOLD',
    price: 285.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+6',
    category: 'watches',
    brand: 'AIGNER',
    description: 'Elegant rose gold timepiece with intricate detailing and comfortable fit.',
    specifications: {
      caseMaterial: 'Rose Gold Plated',
      caseSize: '32mm',
      dialColor: 'Brown',
      movement: 'Swiss Quartz',
      waterResistance: '50m',
      strapMaterial: 'Leather',
      strapColor: 'Brown',
    },
    stock: 9,
    rating: 4.6,
    reviews: 19
  },
  {
    id: '7',
    name: 'AIGNER PRATO LADIES WATCH 36MM GOLD',
    price: 320.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+7',
    category: 'watches',
    brand: 'AIGNER',
    description: 'Statement gold watch with precision movement and distinctive AIGNER design elements.',
    specifications: {
      caseMaterial: 'Gold Plated',
      caseSize: '36mm',
      dialColor: 'Gold',
      movement: 'Swiss Quartz',
      waterResistance: '30m',
      strapMaterial: 'Gold Plated',
      strapColor: 'Gold',
    },
    stock: 7,
    rating: 4.4,
    reviews: 12
  },
  {
    id: '8',
    name: 'AIGNER MODENA LADIES WATCH 33MM SILVER',
    price: 290.0,
    currency: 'OMR',
    image: 'https://via.placeholder.com/300x300?text=Aigner+Watch+8',
    category: 'watches',
    brand: 'AIGNER',
    discount: 25,
    description: 'Sleek and modern silver watch with versatile design for everyday luxury.',
    specifications: {
      caseMaterial: 'Stainless Steel',
      caseSize: '33mm',
      dialColor: 'Silver',
      movement: 'Swiss Quartz',
      waterResistance: '50m',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
    },
    stock: 14,
    rating: 4.8,
    reviews: 23
  }
];

// Generate more products by duplicating and modifying the sample products
const generateMoreProducts = (count = 32) => {
  const allProducts = [...products];
  const totalNeeded = count - allProducts.length;
  
  if (totalNeeded <= 0) return allProducts.slice(0, count);
  
  for (let i = 0; i < totalNeeded; i++) {
    const sourceProd = products[i % products.length];
    allProducts.push({
      ...sourceProd,
      id: `extended-${i+9}`,
      name: `${sourceProd.name} ${i+9}`,
      price: Math.round((sourceProd.price * (0.9 + Math.random() * 0.3)) * 10) / 10,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : undefined,
      stock: Math.floor(Math.random() * 20) + 1,
      rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5
    });
  }
  
  return allProducts;
};

// Edge function handler
export default async (req: Request) => {
  console.log('Products API request received:', req.url);
  
  // Parse URL and query parameters
  const url = new URL(req.url);
  const brand = url.searchParams.get('brand') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '8');
  const sortBy = url.searchParams.get('sortBy') || 'featured';
  
  // Generate all products
  const allProducts = generateMoreProducts();
  
  // Apply filters
  let filteredProducts = allProducts;
  
  if (brand) {
    console.log(`Filtering by brand: ${brand}`);
    filteredProducts = filteredProducts.filter(p => p.brand.toUpperCase() === brand.toUpperCase());
  }
  
  if (category) {
    console.log(`Filtering by category: ${category}`);
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  // Apply sorting
  console.log(`Sorting by: ${sortBy}`);
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
        const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
        return priceA - priceB;
      });
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
        const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
        return priceB - priceA;
      });
      break;
    case 'newest':
      // For this demo, we'll just randomize the sort order for "newest"
      filteredProducts.sort(() => Math.random() - 0.5);
      break;
    default:
      // 'featured' - no special sorting, use the default order
      break;
  }
  
  // Apply pagination
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  
  console.log(`Returning ${paginatedProducts.length} products (page ${page}/${totalPages})`);
  
  // Return the response
  return new Response(
    JSON.stringify({
      products: paginatedProducts,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
